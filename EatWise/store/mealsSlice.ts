/**
 * Meals Slice
 * Manages meal logging and nutrition data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface NutritionItem {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

export interface Meal {
  id: string;
  title: MealType;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  timestamp: string;
  items: NutritionItem[];
}

interface MealsState {
  mealList: Meal[];
  dailyGoal: number;
  isLoading: boolean;
}

const initialState: MealsState = {
  mealList: [],
  dailyGoal: 2000,
  isLoading: false,
};

const STORAGE_KEY = '@eatwise_meals';

export const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    addMeal: (state, action: PayloadAction<Meal>) => {
      state.mealList.unshift(action.payload);
      saveMealsToStorage(state.mealList);
    },
    removeMeal: (state, action: PayloadAction<string>) => {
      state.mealList = state.mealList.filter((meal) => meal.id !== action.payload);
      saveMealsToStorage(state.mealList);
    },
    updateMeal: (state, action: PayloadAction<Meal>) => {
      const index = state.mealList.findIndex((meal) => meal.id === action.payload.id);
      if (index !== -1) {
        state.mealList[index] = action.payload;
        saveMealsToStorage(state.mealList);
      }
    },
    setMeals: (state, action: PayloadAction<Meal[]>) => {
      state.mealList = action.payload;
    },
    setDailyGoal: (state, action: PayloadAction<number>) => {
      state.dailyGoal = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearMeals: (state) => {
      state.mealList = [];
      saveMealsToStorage([]);
    },
  },
});

// Helper function to save meals to AsyncStorage
async function saveMealsToStorage(meals: Meal[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
  } catch (error) {
    console.error('Error saving meals to storage:', error);
  }
}

// Async thunk to load meals from AsyncStorage
export const loadMealsFromStorage = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const storedMeals = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedMeals) {
      const meals: Meal[] = JSON.parse(storedMeals);
      dispatch(setMeals(meals));
    }
  } catch (error) {
    console.error('Error loading meals from storage:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const {
  addMeal,
  removeMeal,
  updateMeal,
  setMeals,
  setDailyGoal,
  setLoading,
  clearMeals,
} = mealsSlice.actions;

export default mealsSlice.reducer;
