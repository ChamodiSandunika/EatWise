/**
 * Meals Selectors
 * Derived state and computed values for meals
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';

// Base selector
export const selectMeals = (state: RootState) => state.meals;

// Get all meals
export const selectAllMeals = createSelector(
  [selectMeals],
  (meals) => meals.mealList
);

// Get today's meals (filter by today's date)
export const selectTodaysMeals = createSelector(
  [selectAllMeals],
  (meals) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return meals.filter((meal: any) => {
      const mealDate = new Date(meal.timestamp);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === today.getTime();
    });
  }
);

// Calculate today's total calories
export const selectDailyCalories = createSelector(
  [selectTodaysMeals],
  (todaysMeals) => {
    const total = todaysMeals.reduce((total: number, meal: any) => {
      const mealCalories = typeof meal.calories === 'number' ? meal.calories : 0;
      console.log(`🧮 Selector - Adding meal calories: ${mealCalories} (${meal.title})`);
      return total + mealCalories;
    }, 0);
    console.log(`🧮 Selector - Total calories: ${total}`);
    return total;
  }
);

// Calculate today's macros
export const selectDailyMacros = createSelector(
  [selectTodaysMeals],
  (todaysMeals) => {
    return todaysMeals.reduce(
      (totals: any, meal: any) => ({
        protein: totals.protein + meal.macros.protein,
        carbs: totals.carbs + meal.macros.carbs,
        fat: totals.fat + meal.macros.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
  }
);

// Get daily goal
export const selectDailyGoal = createSelector(
  [selectMeals],
  (meals) => meals.dailyGoal
);

// Calculate progress percentage
export const selectCalorieProgress = createSelector(
  [selectDailyCalories, selectDailyGoal],
  (calories, goal) => {
    return Math.min((calories / goal) * 100, 100);
  }
);

// Get loading state
export const selectIsLoading = createSelector(
  [selectMeals],
  (meals) => meals.isLoading
);

// Get meals count for today
export const selectTodaysMealCount = createSelector(
  [selectTodaysMeals],
  (meals) => meals.length
);
