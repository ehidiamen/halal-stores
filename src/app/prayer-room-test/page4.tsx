// pages/prayer-rooms.tsx
"use client";

import { useState } from 'react';
import { 
  fetchPrayerRooms, 
  fetchPrayerRoomById, 
  createPrayerRoom, 
  updatePrayerRoom, 
  deletePrayerRoom,
  PrayerRoom
} from '../../services/prayerRoomService';
import Navbar from '../../components/Navbar';

export default function PrayerRoomTestPage() {
  const [prayerRooms, setPrayerRooms] = useState<PrayerRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<PrayerRoom | null>(null);
  const [newRoom, setNewRoom] = useState<Omit<PrayerRoom, 'id'>>({
    name: '',
    address: '',
    facilities: '',
    latitude: 0,
    longitude: 0,
    cleanlinessRating: 0
  });
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create new prayer room with location validation
  const handleCreate = async () => {
    if (!newRoom.name || !newRoom.address) {
      setStatus('Name and address are required');
      return;
    }

    if (isNaN(newRoom.latitude) || isNaN(newRoom.longitude)) {
      setStatus('Valid latitude and longitude are required');
      return;
    }

    setIsLoading(true);
    try {
      setStatus('Creating new prayer room...');
      const created = await createPrayerRoom({
        ...newRoom,
        latitude: Number(newRoom.latitude),
        longitude: Number(newRoom.longitude)
      });
      setStatus(`Successfully created prayer room with ID ${created.id}`);
      setNewRoom({ 
        name: '', 
        address: '', 
        facilities: '',
        latitude: 0,
        longitude: 0,
        cleanlinessRating: 0
      });
      handleFetchAll();
    } catch (error) {
      setStatus(`Error creating prayer room: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all prayer rooms
  const handleFetchAll = async () => {
    setIsLoading(true);
    try {
      setStatus('Fetching all prayer rooms...');
      const data = await fetchPrayerRooms();
      setPrayerRooms(data);
      setStatus(`Successfully fetched ${data.length} prayer rooms`);
    } catch (error) {
      setStatus(`Error fetching prayer rooms: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Add these input fields to the create form section
  return (
    <div>
      {/* ... existing code ... */}
      <div className="p-4 border rounded col-span-full">
        <h2 className="text-xl font-semibold mb-2">Create New Prayer Room</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* ... existing fields ... */}
          <div>
            <label className="block mb-1 font-medium">Latitude*</label>
            <input
              type="number"
              value={newRoom.latitude}
              onChange={(e) => setNewRoom({...newRoom, latitude: parseFloat(e.target.value)})}
              className="w-full p-2 border rounded"
              step="any"
              min="-90"
              max="90"
              placeholder="e.g., 40.7128"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Longitude*</label>
            <input
              type="number"
              value={newRoom.longitude}
              onChange={(e) => setNewRoom({...newRoom, longitude: parseFloat(e.target.value)})}
              className="w-full p-2 border rounded"
              step="any"
              min="-180"
              max="180"
              placeholder="e.g., -74.0060"
            />
          </div>
        </div>
        <button 
          onClick={handleCreate}
          disabled={isLoading || !newRoom.name || !newRoom.address || 
                  isNaN(newRoom.latitude) || isNaN(newRoom.longitude)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Create Prayer Room
        </button>
      </div>
    </div>
  );
}