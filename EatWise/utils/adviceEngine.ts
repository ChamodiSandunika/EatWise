/**
 * Smart Health Advice Engine
 * Analyzes meal nutrition data and generates personalized health recommendations
 */

import type { Meal } from '../store/mealsSlice';

export interface AdviceMessage {
  id: string;
  type: 'warning' | 'tip' | 'positive' | 'info';
  category: 'calories' | 'protein' | 'carbs' | 'fat' | 'sugar' | 'sodium' | 'general';
  icon: string; // Feather icon name
  message: string;
  priority: number; // 1 = high, 2 = medium, 3 = low
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
}

/**
 * Calculate nutrition totals from meals
 */
export function calculateNutritionTotals(meals: Meal[]): NutritionTotals {
  return meals.reduce(
    (totals, meal) => {
      const mealCalories = typeof meal.calories === 'number' ? meal.calories : 0;
      const mealProtein = typeof meal.macros.protein === 'number' ? meal.macros.protein : 0;
      const mealCarbs = typeof meal.macros.carbs === 'number' ? meal.macros.carbs : 0;
      const mealFat = typeof meal.macros.fat === 'number' ? meal.macros.fat : 0;

      // Calculate sugar and sodium from items
      let mealSugar = 0;
      let mealSodium = 0;
      
      if (meal.items && Array.isArray(meal.items)) {
        meal.items.forEach((item) => {
          mealSugar += item.sugar_g || 0;
          mealSodium += item.sodium_mg || 0;
        });
      }

      return {
        calories: totals.calories + mealCalories,
        protein: totals.protein + mealProtein,
        carbs: totals.carbs + mealCarbs,
        fat: totals.fat + mealFat,
        sugar: totals.sugar + mealSugar,
        sodium: totals.sodium + mealSodium,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0 }
  );
}

/**
 * Generate daily-level advice based on total intake vs goal
 */
export function generateDailyAdvice(
  totals: NutritionTotals,
  dailyGoal: number,
  mealCount: number
): AdviceMessage[] {
  const advice: AdviceMessage[] = [];
  const caloriePercent = (totals.calories / dailyGoal) * 100;

  // Calorie-based advice
  if (totals.calories > dailyGoal) {
    advice.push({
      id: 'daily-calories-over',
      type: 'warning',
      category: 'calories',
      icon: 'trending-down',
      message: `You have exceeded your daily calorie target by ${Math.round(totals.calories - dailyGoal)} cal. Choose lighter foods for your next meal.`,
      priority: 1,
    });
  } else if (caloriePercent >= 70 && caloriePercent <= 90) {
    advice.push({
      id: 'daily-calories-close',
      type: 'tip',
      category: 'calories',
      icon: 'alert-circle',
      message: `You are close to your daily calorie limit (${Math.round(caloriePercent)}%). Consider a light snack if needed.`,
      priority: 2,
    });
  } else if (caloriePercent < 40 && mealCount < 2) {
    advice.push({
      id: 'daily-calories-low',
      type: 'warning',
      category: 'calories',
      icon: 'trending-up',
      message: 'You are under your calorie intake. Do not skip essential meals.',
      priority: 1,
    });
  } else if (caloriePercent >= 50 && caloriePercent < 70) {
    advice.push({
      id: 'daily-calories-good',
      type: 'positive',
      category: 'calories',
      icon: 'thumbs-up',
      message: 'Great job! Your calorie intake is on track.',
      priority: 3,
    });
  }

  // Macro-based advice
  const totalMacroGrams = totals.protein + totals.carbs + totals.fat;
  if (totalMacroGrams > 0) {
    const carbPercent = (totals.carbs / totalMacroGrams) * 100;
    const proteinPercent = (totals.protein / totalMacroGrams) * 100;
    const fatPercent = (totals.fat / totalMacroGrams) * 100;

    // High carbs (>55% of macros)
    if (carbPercent > 55) {
      advice.push({
        id: 'macro-carbs-high',
        type: 'tip',
        category: 'carbs',
        icon: 'pie-chart',
        message: "Today's carb intake is high. Add more protein-rich foods in your next meal.",
        priority: 2,
      });
    }

    // Low protein (<20% of macros)
    if (proteinPercent < 20) {
      advice.push({
        id: 'macro-protein-low',
        type: 'tip',
        category: 'protein',
        icon: 'activity',
        message: 'Consider including eggs, yogurt, dhal, or grilled chicken for more protein.',
        priority: 2,
      });
    } else if (proteinPercent >= 25) {
      advice.push({
        id: 'macro-protein-good',
        type: 'positive',
        category: 'protein',
        icon: 'thumbs-up',
        message: 'Great job! Your protein intake looks balanced today.',
        priority: 3,
      });
    }

    // High fat (>35% of macros)
    if (fatPercent > 35) {
      advice.push({
        id: 'macro-fat-high',
        type: 'warning',
        category: 'fat',
        icon: 'droplet',
        message: 'Your fat intake is high. Reduce oily or fried foods.',
        priority: 2,
      });
    }
  }

  // Sugar advice (WHO recommends <50g per day, ideally <25g)
  if (totals.sugar > 50) {
    advice.push({
      id: 'daily-sugar-high',
      type: 'warning',
      category: 'sugar',
      icon: 'trending-up',
      message: 'Your meals today include high sugar content. Reduce sugary snacks and drinks.',
      priority: 1,
    });
  } else if (totals.sugar < 25) {
    advice.push({
      id: 'daily-sugar-good',
      type: 'positive',
      category: 'sugar',
      icon: 'thumbs-up',
      message: 'Nice! Your sugar levels are within healthy limits.',
      priority: 3,
    });
  }

  // Sodium advice (WHO recommends <2000mg per day)
  if (totals.sodium > 2000) {
    advice.push({
      id: 'daily-sodium-high',
      type: 'warning',
      category: 'sodium',
      icon: 'alert-triangle',
      message: 'High sodium detected. Try to avoid processed foods in your next meal.',
      priority: 1,
    });
  } else if (totals.sodium < 1500) {
    advice.push({
      id: 'daily-sodium-good',
      type: 'positive',
      category: 'sodium',
      icon: 'check-circle',
      message: 'Your sodium intake is well-controlled. Keep it up!',
      priority: 3,
    });
  }

  return advice;
}

/**
 * Generate meal-specific advice
 */
export function generateMealAdvice(meal: Meal): AdviceMessage[] {
  const advice: AdviceMessage[] = [];
  const mealCalories = typeof meal.calories === 'number' ? meal.calories : 0;
  const mealProtein = typeof meal.macros.protein === 'number' ? meal.macros.protein : 0;
  const mealFat = typeof meal.macros.fat === 'number' ? meal.macros.fat : 0;

  // High calorie meal
  if (mealCalories > 600) {
    advice.push({
      id: `meal-${meal.id}-calories-high`,
      type: 'tip',
      category: 'calories',
      icon: 'alert-circle',
      message: `"${meal.description}" is a bit heavy (${Math.round(mealCalories)} cal). Balance with a lighter meal later.`,
      priority: 2,
    });
  }

  // Low protein meal
  if (mealProtein < 10 && mealCalories > 200) {
    advice.push({
      id: `meal-${meal.id}-protein-low`,
      type: 'tip',
      category: 'protein',
      icon: 'activity',
      message: `"${meal.description}" lacks protein. Add eggs, yogurt, or beans next time.`,
      priority: 2,
    });
  }

  // High fat meal
  if (mealFat > 20) {
    advice.push({
      id: `meal-${meal.id}-fat-high`,
      type: 'tip',
      category: 'fat',
      icon: 'droplet',
      message: `"${meal.description}" contains high fat (${mealFat.toFixed(1)}g). Consider steaming or grilling instead of frying.`,
      priority: 2,
    });
  }

  // Balanced meal (positive reinforcement)
  if (
    mealCalories >= 300 &&
    mealCalories <= 500 &&
    mealProtein >= 15 &&
    mealFat < 15
  ) {
    advice.push({
      id: `meal-${meal.id}-balanced`,
      type: 'positive',
      category: 'general',
      icon: 'heart',
      message: `"${meal.description}" is well-balanced! Great nutritional choice.`,
      priority: 3,
    });
  }

  return advice;
}

/**
 * Main function to analyze day and generate all advice
 */
export function analyzeDay(
  meals: Meal[],
  dailyGoal: number
): { totals: NutritionTotals; advice: AdviceMessage[] } {
  const totals = calculateNutritionTotals(meals);
  
  // Generate daily advice
  const dailyAdvice = generateDailyAdvice(totals, dailyGoal, meals.length);
  
  // Generate meal-specific advice (only for today's meals)
  const mealAdvice = meals.flatMap((meal) => generateMealAdvice(meal));
  
  // Combine and sort by priority
  const allAdvice = [...dailyAdvice, ...mealAdvice].sort(
    (a, b) => a.priority - b.priority
  );

  return { totals, advice: allAdvice };
}

/**
 * Get motivational message based on overall performance
 */
export function getMotivationalMessage(
  totals: NutritionTotals,
  dailyGoal: number,
  mealCount: number
): string {
  const caloriePercent = (totals.calories / dailyGoal) * 100;
  
  if (mealCount === 0) {
    return "Start your day by logging your first meal! 🌅";
  }
  
  if (caloriePercent < 50 && mealCount >= 2) {
    return "You're doing great! Keep maintaining a balanced diet. 💪";
  }
  
  if (caloriePercent >= 50 && caloriePercent <= 80) {
    return "Excellent progress! You're on track with your nutrition goals. 🎯";
  }
  
  if (caloriePercent > 100) {
    return "Tomorrow is a new day! Focus on lighter, nutritious meals. 🌟";
  }
  
  return "Keep up the healthy eating habits! You're doing amazing. ❤️";
}
