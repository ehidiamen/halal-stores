import { apiClient } from './api';

export interface PrayerRoom {
  id: number;
  name: string;
  address: string;
  facilities: string;
  latitude: number;
  longitude: number;
  cleanlinessRating: number;
  createdAt?: string;
}

export const fetchPrayerRooms = async (): Promise<PrayerRoom[]> => 
  apiClient.get('/prayer-rooms').then(res => res.data);

export const fetchPrayerRoomById = async (id: number): Promise<PrayerRoom> => 
  apiClient.get(`/prayer-rooms/${id}`).then(res => res.data);

export const createPrayerRoom = async (prayerRoom: Omit<PrayerRoom, 'id'>): Promise<PrayerRoom> => 
  apiClient.post('/prayer-rooms', prayerRoom).then(res => res.data);

export const updatePrayerRoom = async (id: number, prayerRoom: Partial<PrayerRoom>): Promise<PrayerRoom> => 
  apiClient.put(`/prayer-rooms/${id}`, prayerRoom).then(res => res.data);

export const deletePrayerRoom = async (id: number): Promise<void> => 
  apiClient.delete(`/prayer-rooms/${id}`);