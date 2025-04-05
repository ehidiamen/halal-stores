import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchRestaurantById, Restaurant } from '../../services/restaurantService';
import Navbar from '../../components/Navbar';
export default function RestaurantDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (id) {
      fetchRestaurantById(Number(id))
      .then(setRestaurant)
      .catch(err => {
        console.error('Failed to fetch restaurant:', err);
        setError('Failed to load restaurant details');
      });
    }
  }, [id]);
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!restaurant) return <p className="text-center mt-10">Loading...</p>;
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl text-center mt-5">{restaurant.name}</h1>
      <p className="text-center">Location: {restaurant.address}</p>
    </div>
  );
}