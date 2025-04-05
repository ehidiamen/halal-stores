"use client";

import { useEffect, useState } from 'react';
import { fetchPrayerRooms, PrayerRoom } from '../../services/prayerRoomService';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
export default function PrayerRooms() {
  const [prayerRooms, setPrayerRooms] = useState<PrayerRoom[]>([]);
  useEffect(() => { fetchPrayerRooms().then(setPrayerRooms); }, []);
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl text-center mt-5">Prayer Rooms</h1>
      <ul className="p-4">
        {prayerRooms.map(p => (
          <li key={p.id} className="border p-2 my-2 hover:bg-gray-100">
            <Link href={`/prayer-room/${p.id}`} className="text-blue-600 hover:underline">{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}