/**
 * Meal Details Screen
 * Displays detailed information about a specific meal
 */

import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { selectAllMeals } from '../store/mealsSelectors';
import { removeMeal, toggleFavorite } from '../store/mealsSlice';

export default function MealDetailsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { mealId } = useLocalSearchParams();
  const styles = createStyles(isDarkMode);
  
  // Get the meal from Redux store
  const allMeals = useSelector(selectAllMeals);
  const meal = allMeals.find((m: any) => m.id === mealId);

  if (!meal) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={isDarkMode ? '#f9fafb' : '#1f2937'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meal Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Feather name="alert-circle" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>Meal not found</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => router.back()}>
            <Text style={styles.emptyButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(removeMeal(meal.id));
            router.back();
          },
        },
      ]
    );
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(meal.id));
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'Breakfast':
        return 'sunrise';
      case 'Lunch':
        return 'sun';
      case 'Dinner':
        return 'moon';
      case 'Snack':
        return 'coffee';
      default:
        return 'coffee';
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'Breakfast':
        return '#f59e0b';
      case 'Lunch':
        return '#10b981';
      case 'Dinner':
        return '#6366f1';
      case 'Snack':
        return '#ec4899';
      default:
        return '#6b7280';
    }
  };

  const color = getMealColor(meal.title);
  const iconName = getMealIcon(meal.title);
  const mealDate = new Date(meal.timestamp);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color={isDarkMode ? '#f9fafb' : '#1f2937'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Details</Text>
        <TouchableOpacity style={styles.favoriteHeaderButton} onPress={handleToggleFavorite}>
          <Feather
            name="heart"
            size={24}
            color={meal.isFavorite ? '#ef4444' : '#d1d5db'}
            fill={meal.isFavorite ? '#ef4444' : 'none'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Meal Header Card */}
        <View style={styles.mealHeader}>
          <View style={[styles.mealIconLarge, { backgroundColor: color + '20' }]}>
            <Feather name={iconName as any} size={40} color={color} />
          </View>
          <Text style={styles.mealType}>{meal.title}</Text>
          <Text style={styles.mealDescription}>{meal.description}</Text>
          <Text style={styles.mealTime}>
            {mealDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
            {' at '}
            {mealDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </View>

        {/* Calories Card */}
        <View style={styles.card}>
          <View style={styles.caloriesHeader}>
            <Feather name="zap" size={24} color="#10b981" />
            <Text style={styles.cardTitle}>Total Calories</Text>
          </View>
          <Text style={styles.caloriesValue}>{Math.round(meal.calories)}</Text>
          <Text style={styles.caloriesLabel}>calories</Text>
        </View>

        {/* Macronutrients Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Macronutrients</Text>
          <View style={styles.nutrientsGrid}>
            <View style={styles.nutrientItem}>
              <View style={[styles.nutrientIcon, { backgroundColor: '#dbeafe' }]}>
                <Feather name="activity" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.nutrientValue}>{meal.macros.protein}g</Text>
              <Text style={styles.nutrientLabel}>Protein</Text>
            </View>
            <View style={styles.nutrientItem}>
              <View style={[styles.nutrientIcon, { backgroundColor: '#fef3c7' }]}>
                <Feather name="pie-chart" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.nutrientValue}>{meal.macros.carbs}g</Text>
              <Text style={styles.nutrientLabel}>Carbs</Text>
            </View>
            <View style={styles.nutrientItem}>
              <View style={[styles.nutrientIcon, { backgroundColor: '#fce7f3' }]}>
                <Feather name="droplet" size={20} color="#ec4899" />
              </View>
              <Text style={styles.nutrientValue}>{meal.macros.fat}g</Text>
              <Text style={styles.nutrientLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Food Items Card */}
        {meal.items && meal.items.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Food Items ({meal.items.length})</Text>
            {meal.items.map((item: any, index: number) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientLeft}>
                  <View style={styles.ingredientDot} />
                  <View style={styles.ingredientInfo}>
                    <Text style={styles.ingredientName}>{item.name}</Text>
                    <Text style={styles.ingredientAmount}>{item.serving_size_g}g serving</Text>
                  </View>
                </View>
                <View style={styles.ingredientRight}>
                  <Text style={styles.ingredientCalories}>
                    {Math.round(
                      typeof item.calories === 'number' 
                        ? item.calories 
                        : (
                            ((typeof item.protein_g === 'number' ? item.protein_g : 0) * 4) + 
                            (item.carbohydrates_total_g * 4) + 
                            (item.fat_total_g * 9)
                          )
                    )} cal
                  </Text>
                  <View style={styles.ingredientMacros}>
                    <Text style={styles.ingredientMacroText}>
                      P: {typeof item.protein_g === 'number' ? item.protein_g.toFixed(1) : '0.0'}g
                    </Text>
                    <Text style={styles.ingredientMacroText}>
                      C: {item.carbohydrates_total_g.toFixed(1)}g
                    </Text>
                    <Text style={styles.ingredientMacroText}>
                      F: {item.fat_total_g.toFixed(1)}g
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Feather name="trash-2" size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete Meal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Nutrition data provided by API Ninjas
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  favoriteHeaderButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#9ca3af' : '#6b7280',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  mealHeader: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  mealIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealType: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 8,
  },
  mealDescription: {
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  mealTime: {
    fontSize: 14,
    color: '#9ca3af',
  },
  card: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  caloriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginLeft: 8,
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
  },
  caloriesLabel: {
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  nutrientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  nutrientItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  nutrientIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutrientValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginTop: 4,
  },
  nutrientLabel: {
    fontSize: 13,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginTop: 2,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  ingredientLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 12,
    marginTop: 6,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: '600',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  ingredientAmount: {
    fontSize: 13,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  ingredientCalories: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 6,
  },
  ingredientRight: {
    alignItems: 'flex-end',
  },
  ingredientMacros: {
    flexDirection: 'row',
    gap: 8,
  },
  ingredientMacroText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
