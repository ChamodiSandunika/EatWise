/**
 * Authentication Type Definitions
 * All types related to user authentication and user data
 */

export interface User {
  id?: string | number;
  username: string;
  email: string;
  token: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
