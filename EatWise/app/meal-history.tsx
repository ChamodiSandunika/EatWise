/**
 * Meal History Screen
 * Displays all meals grouped by date
 * Uses Redux for state management
 */

import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import MealCard from '../components/MealCard';
import { selectAllMeals, selectIsLoading } from '../store/mealsSelectors';
import type { Meal } from '../store/mealsSlice';
import { loadMealsFromStorage } from '../store/mealsSlice';

interface MealsByDate {
  date: string;
  displayDate: string;
  meals: Meal[];
  totalCalories: number;
}

export default function MealHistoryScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux selectors
  const allMeals = useSelector(selectAllMeals);
  const isLoading = useSelector(selectIsLoading);

  const [refreshing, setRefreshing] = useState(false);

  // Load meals from storage on mount
  useEffect(() => {
    dispatch(loadMealsFromStorage() as any);
  }, [dispatch]);

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(loadMealsFromStorage() as any);
    setRefreshing(false);
  };

  // Handle meal card press
  const handleMealPress = (meal: Meal) => {
    router.push({
      pathname: '/meal-details',
      params: { mealId: meal.id },
    } as any);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time parts for comparison
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  // Group meals by date
  const groupMealsByDate = (): MealsByDate[] => {
    const grouped = new Map<string, Meal[]>();

    allMeals.forEach((meal) => {
      const date = new Date(meal.timestamp);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(meal);
    });

    // Convert to array and sort by date (newest first)
    const result: MealsByDate[] = Array.from(grouped.entries())
      .map(([date, meals]) => {
        const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
        return {
          date,
          displayDate: formatDate(date),
          meals: meals.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ),
          totalCalories,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return result;
  };

  const mealsByDate = groupMealsByDate();

  // Render section header
  const renderSectionHeader = (section: MealsByDate) => (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.dateText}>{section.displayDate}</Text>
        <Text style={styles.mealCountText}>
          {section.meals.length} {section.meals.length === 1 ? 'meal' : 'meals'}
        </Text>
      </View>
      <View style={styles.caloriesBadge}>
        <Feather name="activity" size={16} color="#10b981" />
        <Text style={styles.totalCaloriesText}>{section.totalCalories} cal</Text>
      </View>
    </View>
  );

  // Render meal item
  const renderMealItem = (meal: Meal) => (
    <MealCard
      id={meal.id}
      mealType={meal.title}
      description={meal.description}
      calories={meal.calories}
      timestamp={meal.timestamp}
      onPress={() => handleMealPress(meal)}
    />
  );

  // Render date section
  const renderDateSection = ({ item }: { item: MealsByDate }) => (
    <View style={styles.dateSection}>
      {renderSectionHeader(item)}
      {item.meals.map((meal) => (
        <View key={meal.id}>{renderMealItem(meal)}</View>
      ))}
    </View>
  );

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="calendar" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No meal history</Text>
      <Text style={styles.emptySubtitle}>
        Your meal history will appear here once you start logging meals
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push('/meals')}
      >
        <Feather name="plus" size={20} color="#fff" />
        <Text style={styles.emptyButtonText}>Add Your First Meal</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal History</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="filter" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Summary */}
      {mealsByDate.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{allMeals.length}</Text>
            <Text style={styles.statLabel}>Total Meals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{mealsByDate.length}</Text>
            <Text style={styles.statLabel}>Days Tracked</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {Math.round(
                mealsByDate.reduce((sum, day) => sum + day.totalCalories, 0) /
                  mealsByDate.length
              )}
            </Text>
            <Text style={styles.statLabel}>Avg Calories</Text>
          </View>
        </View>
      )}

      {/* History List */}
      <FlatList
        data={mealsByDate}
        renderItem={renderDateSection}
        keyExtractor={(item) => item.date}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981"
            colors={['#10b981']}
          />
        }
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  dateSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  mealCountText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  caloriesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  totalCaloriesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
