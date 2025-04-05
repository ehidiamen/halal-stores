import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchPrayerRoomById, PrayerRoom } from '../../services/prayerRoomService';
import Navbar from '../../components/Navbar';
export default function PrayerRoomDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [prayerRoom, setPrayerRoom] = useState<PrayerRoom | null>(null);
  useEffect(() => {
    if (id) {
      fetchPrayerRoomById(Number(id)).then(setPrayerRoom);
    }
  }, [id]);
  if (!prayerRoom) return <p className="text-center mt-10">Loading...</p>;
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl text-center mt-5">{prayerRoom.name}</h1>
    </div>
  );
}
