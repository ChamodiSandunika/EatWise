# Calorie Display Debug Guide

## Problem
Calories showing as "0 cal" despite adding meals

## What Was Fixed
1. ✅ Updated `meal-details.tsx` to use real Redux data instead of hardcoded sample data
2. ✅ Fixed all property name mismatches (mealType → title, nutrients → macros, ingredients → items)
3. ✅ Added comprehensive logging to trace data flow

## How to Test

### Step 1: Start the App
```bash
npx expo start
```

### Step 2: Add a Meal
1. Tap the green "+" button on home screen
2. Select meal type (e.g., "Breakfast")
3. Enter a meal description (e.g., "2 eggs and toast")
4. Tap "Analyze Meal" button
5. Wait for nutrition data to load
6. **CHECK CONSOLE** - You should see:
   ```
   🔍 Fetching nutrition for: 2 eggs and toast
   ✅ Successfully fetched X items
   📊 Totals calculated: { calories: XXX, protein: XX, carbs: XX, fat: XX }
   📦 Nutrition results: [array of items with calories]
   💾 Saving meal: {full meal object with calories value}
   ```
7. Tap "Save Meal" button
8. **CHECK ALERT** - Should show: "Meal logged with XXX calories!"

### Step 3: Verify Home Screen Display
1. You should be back on home screen
2. **CHECK CONSOLE** - You should see:
   ```
   🏠 Home Screen - Today's Meals: 1
   🏠 Home Screen - Daily Calories: XXX
   🏠 Home Screen - Daily Goal: 2000
   🏠 First meal data: {full meal object}
   🧮 Selector - Adding meal calories: XXX (Breakfast)
   🧮 Selector - Total calories: XXX
   ```
3. **CHECK UI** - Daily summary card should show:
   - Consumed: XXX (not 0)
   - Remaining: 2000 - XXX
   - Progress bar should be filled proportionally

4. **CHECK MEAL CARD** - Should display:
   - Meal type (e.g., "Breakfast")
   - Description (e.g., "2 eggs and toast")
   - Calories badge with real value (e.g., "XXX cal")

### Step 4: Verify Meal Details Screen
1. Tap on the meal card
2. **CHECK MEAL DETAILS** - Should display:
   - Total Calories: XXX (large number, not 0)
   - Macronutrients: Protein XXg, Carbs XXg, Fat XXg
   - Food Items section with each item showing:
     - Item name (e.g., "eggs")
     - Serving size (e.g., "100g serving")
     - Individual calories (e.g., "140 cal")
     - Macros breakdown (P: XXg, C: XXg, F: XXg)

### Step 5: Add Multiple Meals
1. Go back to home
2. Add another meal (e.g., Lunch)
3. **CHECK** - Daily total should increase
4. **CHECK CONSOLE** - Should show:
   ```
   🏠 Home Screen - Today's Meals: 2
   🏠 Home Screen - Daily Calories: XXX (sum of both meals)
   🧮 Selector - Adding meal calories: XXX (Breakfast)
   🧮 Selector - Adding meal calories: XXX (Lunch)
   🧮 Selector - Total calories: XXX (total)
   ```

## Expected Data Structure

### Meal Object
```json
{
  "id": "1732xxxxx",
  "title": "Breakfast",
  "description": "2 eggs and toast",
  "calories": 300,
  "macros": {
    "protein": 20.5,
    "carbs": 25.3,
    "fat": 15.2
  },
  "timestamp": "2025-11-23T10:30:00.000Z",
  "items": [
    {
      "name": "eggs",
      "calories": 140,
      "serving_size_g": 100,
      "protein_g": 12.5,
      "carbohydrates_total_g": 1.1,
      "fat_total_g": 9.5
    },
    {
      "name": "toast",
      "calories": 160,
      "serving_size_g": 50,
      "protein_g": 8.0,
      "carbohydrates_total_g": 24.2,
      "fat_total_g": 5.7
    }
  ]
}
```

## Troubleshooting

### If Calories Still Show as 0

1. **Check API Key**
   - Open `.env` file
   - Verify `EXPO_PUBLIC_API_NINJAS_KEY=your_actual_key`
   - Get free key from: https://api-ninjas.com

2. **Check Console Logs**
   - Look for "📊 Totals calculated" - calories should be > 0
   - Look for "💾 Saving meal" - calories field should be > 0
   - Look for "🏠 Home Screen - Daily Calories" - should be > 0

3. **Check AsyncStorage**
   - Add this code temporarily to check stored data:
   ```typescript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   const checkStorage = async () => {
     const meals = await AsyncStorage.getItem('@eatwise_meals');
     console.log('📱 Stored meals:', meals);
   };
   checkStorage();
   ```

4. **Clear Storage and Try Again**
   ```typescript
   // Add to home screen temporarily
   const clearAll = async () => {
     await AsyncStorage.clear();
     console.log('🗑️ Storage cleared');
   };
   ```

5. **Check API Response**
   - Look for "✅ Successfully fetched X items"
   - If you see errors, check:
     - Internet connection
     - API key validity
     - API rate limits (100 requests/month on free tier)

## Common Issues

### Issue: "API Key Missing" Alert
**Solution**: Add your API key to `.env` file

### Issue: Network Error
**Solution**: Check internet connection, try again

### Issue: Calories are NaN or undefined
**Solution**: Check that API is returning valid numbers in response

### Issue: Meals not persisting after app restart
**Solution**: Check AsyncStorage permissions, verify storage key is correct

## Files Modified
- `app/add-meal.tsx` - Added logging to save function
- `app/(tabs)/index.tsx` - Added logging to display
- `app/meal-details.tsx` - Complete rewrite to use Redux data
- `store/mealsSelectors.ts` - Added logging to calorie calculation

## Next Steps After Testing
Once you confirm everything works:
1. Remove console.log statements for production
2. Add error boundaries for better error handling
3. Consider adding offline support
4. Add loading skeletons for better UX
