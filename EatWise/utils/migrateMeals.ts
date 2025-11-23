/**
 * Storage Migration Utility
 * Recalculates calories for meals with null/string values
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Meal } from '../store/mealsSlice';

const STORAGE_KEY = '@eatwise_meals';

/**
 * Calculate calories from macros (4-4-9 rule)
 * Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
 */
function calculateCaloriesFromMacros(protein: number, carbs: number, fat: number): number {
  return (protein * 4) + (carbs * 4) + (fat * 9);
}

/**
 * Fix a single nutrition item
 */
function fixNutritionItem(item: any): any {
  const fixed = { ...item };
  
  // Fix protein_g if it's a string
  if (typeof fixed.protein_g === 'string') {
    fixed.protein_g = 0;
  }
  
  // Fix calories if it's a string or null
  if (typeof fixed.calories !== 'number' || fixed.calories === null) {
    // Calculate from macros
    const protein = typeof fixed.protein_g === 'number' ? fixed.protein_g : 0;
    const carbs = fixed.carbohydrates_total_g || 0;
    const fat = fixed.fat_total_g || 0;
    fixed.calories = calculateCaloriesFromMacros(protein, carbs, fat);
  }
  
  return fixed;
}

/**
 * Migrate and fix all stored meals
 */
export async function migrateMeals(): Promise<{ fixed: number; total: number }> {
  try {
    const storedMeals = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (!storedMeals) {
      console.log('📦 No meals to migrate');
      return { fixed: 0, total: 0 };
    }
    
    const meals: Meal[] = JSON.parse(storedMeals);
    let fixedCount = 0;
    
    const fixedMeals = meals.map((meal) => {
      let needsFix = false;
      
      // Check if meal needs fixing
      if (meal.calories === null || typeof meal.calories !== 'number') {
        needsFix = true;
      }
      
      if (meal.macros.protein === null || typeof meal.macros.protein !== 'number') {
        needsFix = true;
      }
      
      if (!needsFix) {
        return meal;
      }
      
      fixedCount++;
      
      // Fix the meal's items
      const fixedItems = meal.items.map(fixNutritionItem);
      
      // Recalculate totals from fixed items
      const totals = fixedItems.reduce(
        (acc, item) => ({
          calories: acc.calories + (typeof item.calories === 'number' ? item.calories : 0),
          protein: acc.protein + (typeof item.protein_g === 'number' ? item.protein_g : 0),
          carbs: acc.carbs + (item.carbohydrates_total_g || 0),
          fat: acc.fat + (item.fat_total_g || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      
      console.log(`🔧 Fixed meal "${meal.title}": ${meal.calories} → ${Math.round(totals.calories)} cal`);
      
      return {
        ...meal,
        calories: Math.round(totals.calories),
        macros: {
          protein: Math.round(totals.protein * 10) / 10,
          carbs: Math.round(totals.carbs * 10) / 10,
          fat: Math.round(totals.fat * 10) / 10,
        },
        items: fixedItems,
      };
    });
    
    // Save fixed meals
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fixedMeals));
    
    console.log(`✅ Migration complete: Fixed ${fixedCount} of ${meals.length} meals`);
    
    return { fixed: fixedCount, total: meals.length };
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}

/**
 * Clear all meals (use with caution!)
 */
export async function clearAllMeals(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ All meals cleared');
  } catch (error) {
    console.error('❌ Error clearing meals:', error);
    throw error;
  }
}
