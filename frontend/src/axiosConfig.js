// src/axiosConfig.js

import axios from 'axios';
import { toast } from 'react-toastify';

// Create an Axios instance with default configurations
const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend URL
  withCredentials: true, // Allow sending cookies with requests
});

// Add a request interceptor to include JWT token if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // If using JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle global errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
