import { apiClient } from './api';
export interface User {
  id: number;
  name: string;
  email: string;
}
export const fetchUsers = async (): Promise<User[]> => apiClient.get('/users').then(res => res.data);
export const fetchUserById = async (id: number): Promise<User> => apiClient.get(`/users/${id}`).then(res => res.data);
export const createUser = async (user: User) => apiClient.post('/users', user).then(res => res.data);
export const updateUser = async (id: number, user: User) => apiClient.put(`/users/${id}`, user).then(res => res.data);
export const deleteUser = async (id: number) => apiClient.delete(`/users/${id}`);
