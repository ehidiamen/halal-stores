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
    address: '', // Changed from 'location' to 'address'
    facilities: '',
    latitude: 0,
    longitude: 0,
    cleanlinessRating: 0 // Added missing field
  });
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ... (keep all your existing handler functions the same)

  // In the create handler, update the reset state:
  const handleCreate = async () => {
    if (!newRoom.name || !newRoom.address) { // Changed from location to address
      setStatus('Name and address are required');
      return;
    }

    setIsLoading(true);
    try {
      setStatus('Creating new prayer room...');
      const created = await createPrayerRoom({
        ...newRoom,
        id: 0 // Will be ignored by backend
      });
      setStatus(`Successfully created prayer room with ID ${created.id}`);
      // Reset all fields including coordinates and rating
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

  // In the JSX, update the location input to address:
  return (
    <div>
      <Navbar />  
      <div className="p-4 max-w-4xl mx-auto">
        {/* ... other existing JSX ... */}
        
        {/* Create New Room */}
        <div className="p-4 border rounded col-span-full">
          <h2 className="text-xl font-semibold mb-2">Create New Prayer Room</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* ... other inputs ... */}
            <div>
              <label className="block mb-1 font-medium">Address*</label> {/* Changed from Location */}
              <input
                type="text"
                value={newRoom.address} {/* Changed from location */}
                onChange={(e) => setNewRoom({...newRoom, address: e.target.value})} {/* Changed from location */}
                className="w-full p-2 border rounded"
                placeholder="Street address"
              />
            </div>
            {/* ... other inputs ... */}
          </div>
          <button 
            onClick={handleCreate}
            disabled={isLoading || !newRoom.name || !newRoom.address} {/* Changed from location */}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Create Prayer Room
          </button>
        </div>

        {/* In the Selected Room display */}
        {selectedRoom && (
          <div>
            {/* ... */}
            <p><span className="font-medium">Address:</span> {selectedRoom.address}</p> {/* Changed from Location */}
            {/* ... */}
          </div>
        )}
      </div>
    </div>
  );
}