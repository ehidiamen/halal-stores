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
    location: '',
    facilities: ''
  });
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // Fetch single prayer room by ID
  const handleFetchById = async (id: number) => {
    setIsLoading(true);
    try {
      setStatus(`Fetching prayer room with ID ${id}...`);
      const data = await fetchPrayerRoomById(id);
      setSelectedRoom(data);
      setStatus(`Successfully fetched: ${data.name}`);
    } catch (error) {
      setStatus(`Error fetching prayer room: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new prayer room
  const handleCreate = async () => {
    if (!newRoom.name || !newRoom.location) {
      setStatus('Name and location are required');
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
      setNewRoom({ name: '', location: '', facilities: '' });
      handleFetchAll(); // Refresh list
    } catch (error) {
      setStatus(`Error creating prayer room: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Update prayer room
  const handleUpdate = async () => {
    if (!selectedRoom) return;

    setIsLoading(true);
    try {
      setStatus(`Updating prayer room with ID ${selectedRoom.id}...`);
      const updated = await updatePrayerRoom(selectedRoom.id, {
        ...selectedRoom,
        name: `${selectedRoom.name} (Updated)`
      });
      setSelectedRoom(updated);
      setStatus(`Successfully updated: ${updated.name}`);
      handleFetchAll(); // Refresh list
    } catch (error) {
      setStatus(`Error updating prayer room: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete prayer room
  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      setStatus(`Deleting prayer room with ID ${id}...`);
      await deletePrayerRoom(id);
      setStatus(`Successfully deleted prayer room with ID ${id}`);
      setSelectedRoom(null);
      handleFetchAll(); // Refresh list
    } catch (error) {
      setStatus(`Error deleting prayer room: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
    <Navbar />  
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Prayer Room Service</h1>
      
      {/* Status Display */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        <div className={`p-2 rounded ${status.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {isLoading ? 'Loading...' : status || 'Ready to test'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fetch Operations */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Fetch Operations</h2>
          <button 
            onClick={handleFetchAll}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2 disabled:bg-gray-400"
          >
            Fetch All Prayer Rooms
          </button>
          
          {prayerRooms.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Prayer Rooms List</h3>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {prayerRooms.map(room => (
                  <li 
                    key={room.id} 
                    className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleFetchById(room.id)}
                  >
                    {room.name} (ID: {room.id})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Selected Room */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Selected Prayer Room</h2>
          {selectedRoom ? (
            <div>
              <div className="mb-4 space-y-2">
                <p><span className="font-medium">Name:</span> {selectedRoom.name}</p>
                <p><span className="font-medium">Location:</span> {selectedRoom.location}</p>
                <p><span className="font-medium">Facilities:</span> {selectedRoom.facilities || 'None'}</p>
              </div>
              <div className="space-x-2">
                <button 
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-400"
                >
                  Update (Add "Updated")
                </button>
                <button 
                  onClick={() => handleDelete(selectedRoom.id)}
                  disabled={isLoading}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p>No prayer room selected</p>
          )}
        </div>

        {/* Create New Room */}
        <div className="p-4 border rounded col-span-full">
          <h2 className="text-xl font-semibold mb-2">Create New Prayer Room</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Name*</label>
              <input
                type="text"
                value={newRoom.name}
                onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Prayer room name"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Location*</label>
              <input
                type="text"
                value={newRoom.location}
                onChange={(e) => setNewRoom({...newRoom, location: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Building/Floor"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Facilities</label>
              <input
                type="text"
                value={newRoom.facilities || ''}
                onChange={(e) => setNewRoom({...newRoom, facilities: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Wudu area, prayer mats, etc."
              />
            </div>
          </div>
          <button 
            onClick={handleCreate}
            disabled={isLoading || !newRoom.name || !newRoom.location}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Create Prayer Room
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}