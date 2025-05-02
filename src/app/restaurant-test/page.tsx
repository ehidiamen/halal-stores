// pages/restaurants.tsx
"use client";

import { useState } from 'react';
import { 
  fetchRestaurants, 
  fetchRestaurantById, 
  createRestaurant, 
  updateRestaurant, 
  deleteRestaurant,
  Restaurant,
  NewRestaurant
} from '../../services/restaurantService';
import Navbar from '../../components/Navbar';

export default function RestaurantTestPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [newRestaurant, setNewRestaurant] = useState<Omit<Restaurant, 'restaurantId'>>({
    name: '',
    address: '',
    city: '',
    country: '',
    rating: 0,
    cuisineType: '',
    verified: false,
    latitude: 0,
    longitude: 0,
    createdAt: ''
  });
  const [status, setStatus] = useState<string>('');

  // Test fetch single restaurant
  const testFetchSingle = async (id: number) => {
    try {
      setStatus(`Fetching restaurant with ID ${id}...`);
      const data = await fetchRestaurantById(id);
      setSelectedRestaurant(data);
      setStatus(`Successfully fetched restaurant: ${data.name}`);
      console.log(`${data.latitude}`);
    } catch (error) {
      setStatus(`Error fetching restaurant: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Test create restaurant with location validation
  const testCreate = async () => {
    if (!newRestaurant.name || !newRestaurant.address) {
      setStatus('Name and address are required');
      return;
    }

    if (isNaN(newRestaurant.latitude) || isNaN(newRestaurant.longitude)) {
      setStatus('Valid latitude and longitude are required');
      return;
    }

    try {
      setStatus('Creating new restaurant...');
      const created = await createRestaurant({
        ...newRestaurant,
        latitude: Number(newRestaurant.latitude),
        longitude: Number(newRestaurant.longitude)
      });
      setStatus(`Successfully created restaurant with ID ${created.restaurantId}`);
      setNewRestaurant({
        name: '',
        address: '',
        city: '',
        country: '',
        rating: 0,
        cuisineType: '',
        verified: false,
        latitude: 0,
        longitude: 0,
        createdAt: ''
      });
      testFetchAll();
    } catch (error) {
      setStatus(`Error creating restaurant: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  // Test fetch all restaurants
  const testFetchAll = async () => {
    try {
      setStatus('Fetching all restaurants...');
      const data = await fetchRestaurants();
      setRestaurants(data);
      setStatus(`Successfully fetched ${data.length} restaurants`);
    } catch (error) {
      setStatus(`Error fetching restaurants: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Test update restaurant
  const testUpdate = async (id: number) => {
    if (!selectedRestaurant) return;
    
    try {
      setStatus(`Updating restaurant with ID ${id}...`);
      const updated = await updateRestaurant(id, {
        ...selectedRestaurant,
        name: `${selectedRestaurant.name} (Updated)`
      });
      setSelectedRestaurant(updated);
      setStatus(`Successfully updated restaurant: ${updated.name}`);
      testFetchAll(); // Refresh the list
    } catch (error) {
      setStatus(`Error updating restaurant: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Test delete restaurant
  const testDelete = async (id: number) => {
    try {
      setStatus(`Deleting restaurant with ID ${id}...`);
      await deleteRestaurant(id);
      setStatus(`Successfully deleted restaurant with ID ${id}`);
      setSelectedRestaurant(null);
      testFetchAll(); // Refresh the list
    } catch (error) {
      setStatus(`Error deleting restaurant: ${error instanceof Error ? error.message : String(error)}`);
    }
  };


  // Add these input fields to the create form section
  return (
    <div>
    <Navbar />
   <div className="p-4 max-w-4xl mx-auto">    
    <h1 className="text-2xl font-bold mb-4">Restaurant Service</h1>
      
    <div className="mb-6 p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">Current Status</h2>
      <div className="p-2 bg-gray-100 rounded">
        {status || 'No operations performed yet'}
      </div>
    </div> 
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fetch Operations */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Fetch Operations</h2>
          <button 
            onClick={testFetchAll}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
          >
            Fetch All Restaurants
          </button>
          
          {restaurants.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Restaurants List</h3>
              <ul className="space-y-2">
                {restaurants.map(restaurant => (
                  <li 
                    key={restaurant.restaurantId} 
                    className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => testFetchSingle(restaurant.restaurantId)}
                  >
                    {restaurant.name} (ID: {restaurant.restaurantId})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      {/* Selected Restaurant */}
      <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Selected Restaurant</h2>
          {selectedRestaurant ? (
            <div>
              <div className="mb-4">
                <h3 className="font-medium">{selectedRestaurant.name}</h3>
                <p>Address: {selectedRestaurant.address}</p>
                <p>City: {selectedRestaurant.city}</p>
                <p>Rating: {selectedRestaurant.rating}</p>
              </div>
              <div className="space-x-2">
                <button 
                  onClick={() => testUpdate(selectedRestaurant.restaurantId)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Update (Add "Updated")
                </button>
                <button 
                  onClick={() => testDelete(selectedRestaurant.restaurantId)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p>No restaurant selected</p>
          )}
        </div>
      <div className="p-4 border rounded col-span-full">
        <h2 className="text-xl font-semibold mb-2">Create New Restaurant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* ... existing fields ... */}
          <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={newRestaurant.name}
                onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Address</label>
              <input
                type="text"
                value={newRestaurant.address}
                onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          <div>
              <label className="block mb-1">City</label>
              <input
                type="text"
                value={newRestaurant.city}
                onChange={(e) => setNewRestaurant({...newRestaurant, city: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Country</label>
              <input
                type="text"
                value={newRestaurant.country}
                onChange={(e) => setNewRestaurant({...newRestaurant, country: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          <div>
              <label className="block mb-1">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={newRestaurant.rating}
                onChange={(e) => setNewRestaurant({...newRestaurant, rating: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Cuisine Type</label>
              <input
                type="text"
                value={newRestaurant.cuisineType}
                onChange={(e) => setNewRestaurant({...newRestaurant, cuisineType: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          <div className="flex items-center">
              <input
                type="checkbox"
                checked={newRestaurant.verified}
                onChange={(e) => setNewRestaurant({...newRestaurant, verified: e.target.checked})}
                className="mr-2"
              />
              <label>Verified</label>
            </div>
          <div>
            <label className="block mb-1">Latitude</label>
            <input
              type="number"
              value={newRestaurant.latitude}
              onChange={(e) => setNewRestaurant({...newRestaurant, latitude: parseFloat(e.target.value)})}
              className="w-full p-2 border rounded"
              step="any"
              min="-90"
              max="90"
            />
          </div>
          <div>
            <label className="block mb-1">Longitude</label>
            <input
              type="number"
              value={newRestaurant.longitude}
              onChange={(e) => setNewRestaurant({...newRestaurant, longitude: parseFloat(e.target.value)})}
              className="w-full p-2 border rounded"
              step="any"
              min="-180"
              max="180"
            />
          </div>
        </div>
        <button 
          onClick={testCreate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!newRestaurant.name || !newRestaurant.address || 
                   isNaN(newRestaurant.latitude) || isNaN(newRestaurant.longitude)}
        >
          Create Restaurant
        </button>
      </div>
    </div>
    </div>
    </div>
  );
}