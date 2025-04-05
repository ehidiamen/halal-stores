import { apiClient } from './api';
export interface Review {
  id: number;
  content: string;
  rating: number;
}
export const fetchReviews = async (): Promise<Review[]> => apiClient.get('/reviews').then(res => res.data);
export const fetchReviewById = async (id: number): Promise<Review> => apiClient.get(`/reviews/${id}`).then(res => res.data);
export const createReview = async (review: Review) => apiClient.post('/reviews', review).then(res => res.data);
export const updateReview = async (id: number, review: Review) => apiClient.put(`/reviews/${id}`, review).then(res => res.data);
export const deleteReview = async (id: number) => apiClient.delete(`/reviews/${id}`);
