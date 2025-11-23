/**
 * Add Meal Screen
 * Natural language food input with API Ninjas nutrition extraction
 * Supports free-text meal descriptions like "3 hoppers + sambol"
 */

import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { useTheme } from '../contexts/ThemeContext';
import { useThemedAlert } from '../hooks/useThemedAlert';
import type { MealType, NutritionItem } from '../store/mealsSlice';
import { addMeal } from '../store/mealsSlice';
import { ThemedAlert } from '../utils/themedAlert';

const API_KEY = process.env.EXPO_PUBLIC_API_NINJAS_KEY;
const API_URL = 'https://api.api-ninjas.com/v1/nutrition';

interface MealTypeOption {
  type: MealType;
  icon: string;
  color: string;
  bgColor: string;
}

const MEAL_TYPES: MealTypeOption[] = [
  { type: 'Breakfast', icon: 'coffee', color: '#f59e0b', bgColor: '#fef3c7' },
  { type: 'Lunch', icon: 'sun', color: '#3b82f6', bgColor: '#dbeafe' },
  { type: 'Dinner', icon: 'moon', color: '#8b5cf6', bgColor: '#ede9fe' },
  { type: 'Snack', icon: 'star', color: '#ec4899', bgColor: '#fce7f3' },
];

export default function AddMealScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { alertConfig, isVisible, showAlert, hideAlert } = useThemedAlert();

  const [selectedMealType, setSelectedMealType] = useState<MealType>('Breakfast');
  const [mealDescription, setMealDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionResults, setNutritionResults] = useState<NutritionItem[] | null>(null);

  // Calculate totals from nutrition results
  const calculateTotals = (items: NutritionItem[]) => {
    return items.reduce(
      (totals, item) => {
        // Handle premium API restrictions - calculate calories from macros if unavailable
        let itemCalories = typeof item.calories === 'number' ? item.calories : 0;
        let itemProtein = typeof item.protein_g === 'number' ? item.protein_g : 0;
        
        // If calories is restricted but we have macros, calculate from macros
        // Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
        if (itemCalories === 0 || typeof item.calories === 'string') {
          const carbs = item.carbohydrates_total_g || 0;
          const fat = item.fat_total_g || 0;
          itemCalories = (itemProtein * 4) + (carbs * 4) + (fat * 9);
          console.log(`⚠️ Calculating calories for ${item.name}: P:${itemProtein} C:${carbs} F:${fat} = ${itemCalories} cal`);
        }
        
        return {
          calories: totals.calories + itemCalories,
          protein: totals.protein + itemProtein,
          carbs: totals.carbs + item.carbohydrates_total_g,
          fat: totals.fat + item.fat_total_g,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  // Fetch nutrition data from API
  const fetchNutrition = async () => {
    if (!mealDescription.trim()) {
      showAlert('Empty Input', 'Please enter what you ate');
      return;
    }

    // Check if API key is configured
    if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
      showAlert(
        'API Key Missing',
        'Please add your API Ninjas key to the .env file:\n\nEXPO_PUBLIC_API_NINJAS_KEY=your_key\n\nGet your free key at: https://api-ninjas.com'
      );
      return;
    }

    setIsLoading(true);
    setNutritionResults(null);

    try {
      console.log('🔍 Fetching nutrition for:', mealDescription);
      console.log('🔑 API Key exists:', !!API_KEY);
      console.log('🌐 API URL:', `${API_URL}?query=${encodeURIComponent(mealDescription)}`);

      const response = await fetch(
        `${API_URL}?query=${encodeURIComponent(mealDescription)}`,
        {
          method: 'GET',
          headers: {
            'X-Api-Key': API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      // Get response text for better error debugging
      const responseText = await response.text();
      console.log('📄 Response body:', responseText);

      // Check if response contains error message (even with 200 status)
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Failed to parse response:', e);
        showAlert('Error', 'Invalid response from API. Please try again.');
        setIsLoading(false);
        return;
      }

      // Check for API error response (free tier limitation)
      if (parsedResponse.error) {
        console.error('❌ API Error:', parsedResponse.error);
        
        if (parsedResponse.error.includes('down for free users') || 
            parsedResponse.error.includes('premium subscription')) {
          showAlert(
            'API Temporarily Unavailable',
            'The nutrition API is currently down for free users. You can:\n\n' +
            '1. Try again later\n' +
            '2. Manually enter nutrition values\n' +
            '3. Use alternative nutrition databases\n\n' +
            'We apologize for the inconvenience.'
          );
        } else {
          showAlert('API Error', parsedResponse.error);
        }
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        let errorMessage = 'Failed to fetch nutrition data';
        
        if (response.status === 400) {
          errorMessage = 'Invalid request. Please check your meal description.';
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = 'Invalid API key. Please check your EXPO_PUBLIC_API_NINJAS_KEY in .env file.';
        } else if (response.status === 429) {
          errorMessage = 'API rate limit exceeded. Please try again later.';
        } else if (response.status === 500) {
          errorMessage = 'API server error. Please try again later.';
        }
        
        console.error('❌ API Error:', response.status, responseText);
        showAlert('API Error', `${errorMessage}\n\nStatus: ${response.status}`);
        setIsLoading(false);
        return;
      }

      const data: NutritionItem[] = parsedResponse;
      console.log('✅ Parsed data:', data);

      if (!data || data.length === 0) {
        showAlert(
          'No Results',
          'Could not find nutrition information for this meal. Try being more specific or use common food names.'
        );
        setIsLoading(false);
        return;
      }

      // Check if API returned premium restriction
      const hasPremiumRestriction = data.some(
        item => typeof item.calories === 'string' || typeof item.protein_g === 'string'
      );
      
      if (hasPremiumRestriction) {
        console.warn('⚠️ API returned premium restriction - calculating calories from macros');
        showAlert(
          'Note',
          'Some nutrition data is restricted in the free API tier. Calories will be estimated from available macronutrients (Protein, Carbs, Fat).'
        );
      }

      console.log('✅ Successfully fetched', data.length, 'items');
      setNutritionResults(data);
    } catch (error: any) {
      console.error('❌ Nutrition API Error:', error);
      console.error('❌ Error name:', error?.name);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error stack:', error?.stack);
      
      let errorMessage = 'Failed to fetch nutrition data.';
      
      if (error?.message?.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error?.message?.includes('JSON')) {
        errorMessage = 'Invalid response from API. Please try again.';
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      showAlert(
        'Error',
        errorMessage + '\n\nCheck the console for more details.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Save meal to Redux and navigate
  const saveMeal = () => {
    if (!nutritionResults || nutritionResults.length === 0) {
      showAlert('No Data', 'Please analyze your meal first');
      return;
    }

    const totals = calculateTotals(nutritionResults);

    console.log('📊 Totals calculated:', totals);
    console.log('📦 Nutrition results:', nutritionResults);

    const newMeal = {
      id: Date.now().toString(),
      title: selectedMealType,
      description: mealDescription.trim(),
      calories: Math.round(totals.calories),
      macros: {
        protein: Math.round(totals.protein * 10) / 10,
        carbs: Math.round(totals.carbs * 10) / 10,
        fat: Math.round(totals.fat * 10) / 10,
      },
      timestamp: new Date().toISOString(),
      items: nutritionResults,
    };

    console.log('💾 Saving meal:', JSON.stringify(newMeal, null, 2));
    dispatch(addMeal(newMeal));

    showAlert('Success', `Meal logged with ${Math.round(totals.calories)} calories!`, [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  const totals = nutritionResults ? calculateTotals(nutritionResults) : null;
  const styles = createStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="x" size={24} color={isDarkMode ? '#f9fafb' : '#1f2937'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Meal</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Meal Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meal Type</Text>
            <View style={styles.mealTypeGrid}>
              {MEAL_TYPES.map((mealType) => {
                const isSelected = selectedMealType === mealType.type;
                return (
                  <TouchableOpacity
                    key={mealType.type}
                    style={[
                      styles.mealTypeCard,
                      {
                        backgroundColor: isSelected ? mealType.bgColor : (isDarkMode ? '#1f2937' : '#fff'),
                        borderColor: isSelected ? mealType.color : (isDarkMode ? '#374151' : '#e5e7eb'),
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                    onPress={() => setSelectedMealType(mealType.type)}
                  >
                    <Feather
                      name={mealType.icon as any}
                      size={24}
                      color={isSelected ? mealType.color : (isDarkMode ? '#9ca3af' : '#9ca3af')}
                    />
                    <Text
                      style={[
                        styles.mealTypeText,
                        { color: isSelected ? mealType.color : (isDarkMode ? '#9ca3af' : '#6b7280') },
                      ]}
                    >
                      {mealType.type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Meal Description Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What did you eat?</Text>
            <Text style={styles.sectionHint}>
              Describe your meal naturally, e.g., "3 hoppers and dhal curry" or "2 bananas
              and milk tea"
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 1 plate rice + chicken curry"
              placeholderTextColor="#9ca3af"
              value={mealDescription}
              onChangeText={setMealDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isLoading}
            />

            {/* Analyze Button */}
            <TouchableOpacity
              style={[
                styles.analyzeButton,
                (isLoading || !mealDescription.trim()) && styles.analyzeButtonDisabled,
              ]}
              onPress={fetchNutrition}
              disabled={isLoading || !mealDescription.trim()}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.analyzeButtonText}>Analyzing...</Text>
                </>
              ) : (
                <>
                  <Feather name="zap" size={20} color="#fff" />
                  <Text style={styles.analyzeButtonText}>Analyze Nutrition</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Nutrition Results */}
          {nutritionResults && nutritionResults.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutrition Summary</Text>

              {/* Total Calories Card */}
              <View style={styles.totalCaloriesCard}>
                <View style={styles.caloriesIconContainer}>
                  <Feather name="activity" size={32} color="#10b981" />
                </View>
                <View style={styles.caloriesContent}>
                  <Text style={styles.totalCaloriesValue}>
                    {Math.round(totals!.calories)}
                  </Text>
                  <Text style={styles.totalCaloriesLabel}>Total Calories</Text>
                </View>
              </View>

              {/* Macros Grid */}
              <View style={styles.macrosGrid}>
                <View style={styles.macroCard}>
                  <View style={[styles.macroIcon, { backgroundColor: '#fef3c7' }]}>
                    <Feather name="zap" size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.macroValue}>
                    {Math.round(totals!.protein * 10) / 10}g
                  </Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>

                <View style={styles.macroCard}>
                  <View style={[styles.macroIcon, { backgroundColor: '#dbeafe' }]}>
                    <Feather name="wind" size={20} color="#3b82f6" />
                  </View>
                  <Text style={styles.macroValue}>
                    {Math.round(totals!.carbs * 10) / 10}g
                  </Text>
                  <Text style={styles.macroLabel}>Carbs</Text>
                </View>

                <View style={styles.macroCard}>
                  <View style={[styles.macroIcon, { backgroundColor: '#fce7f3' }]}>
                    <Feather name="droplet" size={20} color="#ec4899" />
                  </View>
                  <Text style={styles.macroValue}>
                    {Math.round(totals!.fat * 10) / 10}g
                  </Text>
                  <Text style={styles.macroLabel}>Fat</Text>
                </View>
              </View>

              {/* Individual Items */}
              <Text style={styles.itemsTitle}>Detected Items</Text>
              {nutritionResults.map((item, index) => {
                const itemCals = typeof item.calories === 'number' 
                  ? item.calories 
                  : (
                      ((typeof item.protein_g === 'number' ? item.protein_g : 0) * 4) + 
                      (item.carbohydrates_total_g * 4) + 
                      (item.fat_total_g * 9)
                    );
                return (
                  <View key={index} style={styles.nutritionItem}>
                    <View style={styles.itemIconContainer}>
                      <Feather name="check-circle" size={20} color="#10b981" />
                    </View>
                    <View style={styles.itemContent}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDetails}>
                        {Math.round(itemCals)} cal • {item.serving_size_g}g serving
                      </Text>
                    </View>
                    <Text style={styles.itemCalories}>{Math.round(itemCals)}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Save Button (Fixed at bottom when results available) */}
        {nutritionResults && nutritionResults.length > 0 && (
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.saveButton} onPress={saveMeal}>
              <Feather name="check" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>Save Meal</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Themed Alert Modal */}
      {alertConfig && (
        <ThemedAlert
          visible={isVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          isDarkMode={isDarkMode}
          onDismiss={hideAlert}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#111827' : '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  headerRight: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mealTypeCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    backgroundColor: isDark ? '#1f2937' : '#fff',
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: isDark ? '#f9fafb' : '#1f2937',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  totalCaloriesCard: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1f2937' : '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  caloriesIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: isDark ? '#10b98133' : '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesContent: {
    flex: 1,
  },
  totalCaloriesValue: {
    fontSize: 36,
    fontWeight: '800',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  totalCaloriesLabel: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginTop: 4,
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  macroCard: {
    flex: 1,
    backgroundColor: isDark ? '#1f2937' : '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  macroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  macroLabel: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginTop: 4,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginTop: 24,
    marginBottom: 12,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1f2937' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#10b98133' : '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#f9fafb' : '#1f2937',
    textTransform: 'capitalize',
  },
  itemDetails: {
    fontSize: 13,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginTop: 2,
  },
  itemCalories: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: isDark ? '#1f2937' : '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#374151' : '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
