"use client";

import { useEffect, useState } from 'react';
import { fetchRestaurants, Restaurant } from '../../services/restaurantService';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
export default function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  useEffect(() => { fetchRestaurants().then(setRestaurants); }, []);
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl text-center mt-5">Halal Restaurants</h1>
      <div className="flex justify-end p-4">
        <Link href="/restaurant/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add New Restaurant</Link>
      </div>
      <ul className="p-4">
        {restaurants.map(r => (
          <li key={r.restaurantId} className="border p-2 my-2 hover:bg-gray-100">
            <Link href={`/restaurant/${r.restaurantId}`} className="text-blue-600 hover:underline">{r.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}