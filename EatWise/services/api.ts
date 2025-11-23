/**
 * API Client Configuration
 * Axios instance with interceptors for authentication
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';

// Using DummyJSON API for authentication
const BASE_URL = 'https://dummyjson.com';

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Add auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = store.getState().auth.user?.token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Login API call
 * @param credentials - Email and password
 * @returns User data with token
 * 
 * DummyJSON Test Credentials:
 * - username: 'emilys', password: 'emilyspass'
 * - username: 'michaelw', password: 'michaelwpass'
 * - username: 'sophiab', password: 'sophiabpass'
 */
export const loginAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('🌐 API: Attempting login with:', credentials.email);
    
    // Extract username from email (part before @)
    // For DummyJSON: emily.johnson@x.dummyjson.com -> emilys (first name + 's')
    let username = credentials.email.split('@')[0];
    
    // If email contains dots, use the first part
    if (username.includes('.')) {
      username = username.split('.')[0]; // emily.johnson -> emily
    }
    
    console.log('🌐 API: Using username:', username);
    
    // DummyJSON login endpoint
    const response = await apiClient.post('/auth/login', {
      username: username,
      password: credentials.password,
      expiresInMins: 30,
    });

    const data = response.data;
    
    console.log('✅ API: Login successful:', data.username);
    
    return {
      user: {
        id: data.id,
        username: data.username,
        email: data.email || credentials.email,
        token: data.token || data.accessToken,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      token: data.token || data.accessToken,
    };
  } catch (error: any) {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 400 || error.response?.status === 401) {
      throw new Error('Invalid username or password. Please try again.');
    }
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Connection timeout. Please check your internet connection.');
    }
    if (error.message.includes('Network Error')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
  }
};

/**
 * Register API call
 * @param data - Registration data
 * @returns User data with token
 * 
 * NOTE: DummyJSON doesn't have a real registration endpoint,
 * so this simulates registration with a delay
 */
export const registerAPI = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock successful registration
    // In production, this would be a real API call
    const mockUser = {
      id: Math.floor(Math.random() * 1000),
      username: data.username,
      email: data.email,
      token: `mock_token_${Date.now()}`,
      firstName: data.username,
      lastName: '',
    };

    return {
      user: mockUser,
      token: mockUser.token,
    };
  } catch (error: any) {
    throw new Error('Registration failed. Please try again.');
  }
};

/**
 * Mock function to validate token
 * In production, this would call your backend to verify the token
 */
export const validateTokenAPI = async (token: string): Promise<boolean> => {
  try {
    // Simulate token validation
    await new Promise((resolve) => setTimeout(resolve, 500));
    return token.length > 0;
  } catch (error) {
    return false;
  }
};

export default apiClient;
