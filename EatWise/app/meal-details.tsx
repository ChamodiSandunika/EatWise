/**
 * Meal Details Screen
 * Displays detailed information about a specific meal
 */

import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MealDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Sample meal data - this will be fetched based on the id
  const meal = {
    id: id as string,
    mealType: 'Breakfast',
    description: '3 hoppers + sambol',
    calories: 450,
    timestamp: new Date(2024, 10, 21, 8, 30),
    nutrients: {
      protein: 12,
      carbs: 58,
      fat: 15,
      fiber: 4,
    },
    ingredients: [
      { name: 'Hoppers', amount: '3 pieces', calories: 300 },
      { name: 'Sambol (coconut)', amount: '2 tbsp', calories: 80 },
      { name: 'Dhal curry', amount: '1 cup', calories: 70 },
    ],
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

  const color = getMealColor(meal.mealType);
  const iconName = getMealIcon(meal.mealType);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Details</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-vertical" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Meal Header Card */}
        <View style={styles.mealHeader}>
          <View style={[styles.mealIconLarge, { backgroundColor: color + '20' }]}>
            <Feather name={iconName as any} size={40} color={color} />
          </View>
          <Text style={styles.mealType}>{meal.mealType}</Text>
          <Text style={styles.mealDescription}>{meal.description}</Text>
          <Text style={styles.mealTime}>
            {meal.timestamp.toLocaleString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
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
          <Text style={styles.caloriesValue}>{meal.calories}</Text>
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
              <Text style={styles.nutrientValue}>{meal.nutrients.protein}g</Text>
              <Text style={styles.nutrientLabel}>Protein</Text>
            </View>
            <View style={styles.nutrientItem}>
              <View style={[styles.nutrientIcon, { backgroundColor: '#fef3c7' }]}>
                <Feather name="pie-chart" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.nutrientValue}>{meal.nutrients.carbs}g</Text>
              <Text style={styles.nutrientLabel}>Carbs</Text>
            </View>
            <View style={styles.nutrientItem}>
              <View style={[styles.nutrientIcon, { backgroundColor: '#fce7f3' }]}>
                <Feather name="droplet" size={20} color="#ec4899" />
              </View>
              <Text style={styles.nutrientValue}>{meal.nutrients.fat}g</Text>
              <Text style={styles.nutrientLabel}>Fat</Text>
            </View>
            <View style={styles.nutrientItem}>
              <View style={[styles.nutrientIcon, { backgroundColor: '#dcfce7' }]}>
                <Feather name="shield" size={20} color="#10b981" />
              </View>
              <Text style={styles.nutrientValue}>{meal.nutrients.fiber}g</Text>
              <Text style={styles.nutrientLabel}>Fiber</Text>
            </View>
          </View>
        </View>

        {/* Ingredients Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingredients</Text>
          {meal.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={styles.ingredientLeft}>
                <View style={styles.ingredientDot} />
                <View>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
                </View>
              </View>
              <Text style={styles.ingredientCalories}>{ingredient.calories} cal</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-2" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Edit Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Feather name="trash-2" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  mealHeader: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
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
    color: '#1f2937',
    marginBottom: 8,
  },
  mealDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  mealTime: {
    fontSize: 14,
    color: '#9ca3af',
  },
  card: {
    backgroundColor: '#fff',
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
    color: '#1f2937',
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
    color: '#6b7280',
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
    color: '#1f2937',
    marginTop: 4,
  },
  nutrientLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 12,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  ingredientAmount: {
    fontSize: 13,
    color: '#6b7280',
  },
  ingredientCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
});
