import { apiClient } from './api';

export interface PrayerRoom {
  id: number;
  name: string;
  location: string;
  facilities: string;
}
export const fetchPrayerRooms = async (): Promise<PrayerRoom[]> => apiClient.get('/prayer-rooms').then(res => res.data);
export const fetchPrayerRoomById = async (id: number): Promise<PrayerRoom> => apiClient.get(`/prayer-rooms/${id}`).then(res => res.data);
export const createPrayerRoom = async (prayerRoom: PrayerRoom) => apiClient.post('/prayer-rooms', prayerRoom).then(res => res.data);
export const updatePrayerRoom = async (id: number, prayerRoom: PrayerRoom) => apiClient.put(`/prayer-rooms/${id}`, prayerRoom).then(res => res.data);
export const deletePrayerRoom = async (id: number) => apiClient.delete(`/prayer-rooms/${id}`);
