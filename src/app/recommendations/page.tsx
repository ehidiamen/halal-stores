// pages/recommendations.tsx
"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

interface Recommendation {
  restaurants: any[];
  prayerRooms: any[];
}

interface Location {
  lat: number;
  lon: number;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation>({ restaurants: [], prayerRooms: [] });
  const [location, setLocation] = useState<Location | null>(null);
  const [manualLocation, setManualLocation] = useState<Location>({ lat: 0, lon: 0 });
  const [radius, setRadius] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  // Fetch recommendations
  const fetchRecommendations = async () => {
    const targetLocation = useCurrentLocation ? location : manualLocation;
    
    if (!targetLocation?.lat || !targetLocation?.lon) {
      setError('Please provide valid location coordinates');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/recommendations?lat=${targetLocation.lat}&lon=${targetLocation.lon}&radius=${radius}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      
      const data = await response.json();
      setRecommendations(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return (R * c).toFixed(1); // Distance in km
  };

  useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation();
    }
  }, [useCurrentLocation]);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Traveler Recommendations</h1>

        {/* Location Selector */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={useCurrentLocation}
              onChange={(e) => setUseCurrentLocation(e.target.checked)}
              className="mr-2"
            />
            <label>Use My Current Location</label>
          </div>

          {!useCurrentLocation && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2">Latitude</label>
                <input
                  type="number"
                  value={manualLocation.lat}
                  onChange={(e) => setManualLocation(prev => ({
                    ...prev,
                    lat: parseFloat(e.target.value)
                  }))}
                  className="w-full p-2 border rounded"
                  step="any"
                />
              </div>
              <div>
                <label className="block mb-2">Longitude</label>
                <input
                  type="number"
                  value={manualLocation.lon}
                  onChange={(e) => setManualLocation(prev => ({
                    ...prev,
                    lon: parseFloat(e.target.value)
                  }))}
                  className="w-full p-2 border rounded"
                  step="any"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2">Search Radius (km)</label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="1"
              max="50"
            />
          </div>

          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Find Recommendations'}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Results Display */}
        {recommendations.restaurants.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Recommended Halal Restaurants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.restaurants.map(restaurant => (
                <div key={restaurant.restaurantId} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-2">{restaurant.address}</p>
                  <div className="flex justify-between text-sm">
                    <span>⭐ {restaurant.rating}/5</span>
                    {location && (
                      <span>
                        {calculateDistance(
                          location.lat,
                          location.lon,
                          restaurant.latitude,
                          restaurant.longitude
                        )} km away
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-2">Cuisine: {restaurant.cuisineType}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.prayerRooms.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Nearby Prayer Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.prayerRooms.map(room => (
                <div key={room.id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg mb-2">{room.name}</h3>
                  <p className="text-gray-600 mb-2">{room.address}</p>
                  <div className="flex justify-between text-sm">
                    <span>🧹 {room.cleanlinessRating}/5</span>
                    {location && (
                      <span>
                        {calculateDistance(
                          location.lat,
                          location.lon,
                          room.latitude,
                          room.longitude
                        )} km away
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-2">Facilities: {room.facilities || 'Basic amenities'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}