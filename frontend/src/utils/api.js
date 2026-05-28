import axios from "axios";

// Base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add JWT to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // if token exists add to header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
