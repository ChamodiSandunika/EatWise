/**
 * AsyncStorage Helper Functions
 * Manages persistent storage for user authentication data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth.types';

const USER_STORAGE_KEY = '@eatwise_user';

/**
 * Save user data to AsyncStorage
 * @param user - User object containing token, username, email
 */
export const saveUserToStorage = async (user: User): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(USER_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving user to storage:', error);
    throw error;
  }
};

/**
 * Get user data from AsyncStorage
 * @returns User object or null if not found
 */
export const getUserFromStorage = async (): Promise<User | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading user from storage:', error);
    return null;
  }
};

/**
 * Remove user data from AsyncStorage (on logout)
 */
export const removeUserFromStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing user from storage:', error);
    throw error;
  }
};

/**
 * Clear all data from AsyncStorage
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};
