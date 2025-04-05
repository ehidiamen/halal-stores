import axios from "axios";

export const API_URL = "http://localhost:8080/api";
//export const API_URL = "http://localhost:8080"; // Remove /api from here
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});