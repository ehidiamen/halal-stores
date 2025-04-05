import { apiClient } from "./api";

export interface Restaurant {
  restaurantId: number;
  name: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  latitude?: number;
  longitude?: number;
  cuisineType: string;
  verified: boolean;
  createdAt: string;
}

export interface NewRestaurant {
  name: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  latitude?: number;
  longitude?: number;
  cuisineType: string;
  verified: boolean;
  createdAt: string;
}

// Update all service functions to use this interface

export const fetchRestaurants = async (): Promise<Restaurant[]> =>
  apiClient.get("/halal-restaurants").then((res) => res.data);

export const fetchRestaurantById = async (id: number): Promise<Restaurant> =>
  apiClient.get(`/halal-restaurants/${id}`).then((res) => res.data);

export const createRestaurant = async (restaurant: NewRestaurant) =>
  apiClient.post("/halal-restaurants", restaurant).then((res) => res.data);

export const updateRestaurant = async (id: number, restaurant: Restaurant) =>
  apiClient.put(`/halal-restaurants/${id}`, restaurant).then((res) => res.data);

export const deleteRestaurant = async (id: number) =>
  apiClient.delete(`/halal-restaurants/${id}`);
