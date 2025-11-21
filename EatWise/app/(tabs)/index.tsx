/**
 * Home Screen
 * Displays daily meal log and calorie tracking
 * Uses Redux for state management, no direct API calls
 */

import { useUser } from '@clerk/clerk-expo';
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
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import DailySummary from '../../components/DailySummary';
import MealCard from '../../components/MealCard';
import {
    selectDailyCalories,
    selectDailyGoal,
    selectIsLoading,
    selectTodaysMealCount,
    selectTodaysMeals,
} from '../../store/mealsSelectors';
import type { Meal } from '../../store/mealsSlice';
import { loadMealsFromStorage } from '../../store/mealsSlice';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useUser();

  // Redux selectors
  const todaysMeals = useSelector(selectTodaysMeals);
  const dailyCalories = useSelector(selectDailyCalories);
  const dailyGoal = useSelector(selectDailyGoal);
  const mealCount = useSelector(selectTodaysMealCount);
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
    // Navigate to details with meal data
    router.push({
      pathname: '/meal-details',
      params: { mealId: meal.id },
    } as any);
  };

  // Get display name
  const displayName =
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
    'Guest';

  // Render meal card
  const renderMealCard = ({ item }: { item: Meal }) => (
    <MealCard
      id={item.id}
      mealType={item.title}
      description={item.description}
      calories={item.calories}
      timestamp={item.timestamp}
      onPress={() => handleMealPress(item)}
    />
  );

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="inbox" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No meals logged yet</Text>
      <Text style={styles.emptySubtitle}>
        Start tracking your nutrition by adding your first meal
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

  // List header component
  const renderListHeader = () => (
    <>
      {/* Daily Summary Card */}
      <DailySummary
        totalCalories={dailyCalories}
        dailyGoal={dailyGoal}
        mealCount={mealCount}
      />

      {/* Section Title */}
      {todaysMeals.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <TouchableOpacity onPress={() => router.push('/meal-history')}>
            <Text style={styles.seeAllText}>History</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>{displayName}!</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Feather name="bell" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Meals List with FlatList */}
      <FlatList
        data={todaysMeals}
        renderItem={renderMealCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
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

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/meals')}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 48,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 24,
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
