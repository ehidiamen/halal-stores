'use client';
import { useState } from 'react';
import { createRestaurant } from '../../../services/restaurantService';
import Navbar from '../../../components/Navbar';
import { useRouter } from 'next/navigation';
export default function NewRestaurant() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let id = 1;
    await createRestaurant({ id, name, location });
    router.push('/restaurants');
  };
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl text-center mt-5">Add New Restaurant</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
        <div className="mb-4">
          <label className="block">Name:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="border w-full p-2" required />
        </div>
        <div className="mb-4">
          <label className="block">Location:</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="border w-full p-2" required />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create</button>
      </form>
    </div>
  );
}
