/**
 * Favorites Screen
 * Display user's favorite meals with quick add functionality
 */

import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addMeal, removeMeal, toggleFavorite, type Meal } from '../../store/mealsSlice';

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const meals = useAppSelector((state) => state.meals.mealList);
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'recent' | 'calories'>('recent');

  // Filter favorite meals
  const favoriteMeals = meals.filter((meal) => meal.isFavorite);

  // Sort by most recent (when the meal was originally created/favorited)
  const recentFavorites = [...favoriteMeals].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Group favorites by calorie ranges for the calories tab
  const calorieRanges = {
    low: favoriteMeals.filter(m => {
      const cal = typeof m.calories === 'number' ? m.calories : 0;
      return cal > 0 && cal <= 300;
    }).sort((a, b) => {
      const calA = typeof a.calories === 'number' ? a.calories : 0;
      const calB = typeof b.calories === 'number' ? b.calories : 0;
      return calA - calB;
    }),
    medium: favoriteMeals.filter(m => {
      const cal = typeof m.calories === 'number' ? m.calories : 0;
      return cal > 300 && cal <= 600;
    }).sort((a, b) => {
      const calA = typeof a.calories === 'number' ? a.calories : 0;
      const calB = typeof b.calories === 'number' ? b.calories : 0;
      return calA - calB;
    }),
    high: favoriteMeals.filter(m => {
      const cal = typeof m.calories === 'number' ? m.calories : 0;
      return cal > 600;
    }).sort((a, b) => {
      const calA = typeof a.calories === 'number' ? a.calories : 0;
      const calB = typeof b.calories === 'number' ? b.calories : 0;
      return calA - calB;
    }),
  };

  const displayMeals = activeTab === 'recent' ? recentFavorites : favoriteMeals;

  const handleQuickAdd = (meal: Meal) => {
    // Create a new meal entry with current timestamp
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isFavorite: true, // Keep it as favorite
    };

    dispatch(addMeal(newMeal));
    Alert.alert('Success', `${meal.description} added to today's meals!`);
  };

  const handleRemoveFavorite = (mealId: string) => {
    Alert.alert(
      'Remove Favorite',
      'Remove this meal from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(toggleFavorite(mealId)),
        },
      ]
    );
  };

  const handleDeleteMeal = (mealId: string) => {
    Alert.alert(
      'Delete Meal',
      'This will permanently delete this meal from your history. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(removeMeal(mealId)),
        },
      ]
    );
  };

  const renderFavoriteMeal = ({ item }: { item: Meal }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <View style={styles.mealHeaderLeft}>
          <View style={[styles.mealTypeIcon, getMealTypeStyle(item.title)]}>
            <Feather name={getMealTypeIcon(item.title)} size={20} color="#fff" />
          </View>
          <View style={styles.mealInfo}>
            <Text style={styles.mealType}>{item.title}</Text>
            <Text style={styles.mealDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleRemoveFavorite(item.id)}
        >
          <Feather name="heart" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.nutritionRow}>
        <View style={styles.nutritionItem}>
          <Feather name="zap" size={16} color="#f59e0b" />
          <Text style={styles.nutritionValue}>
            {Math.round(typeof item.calories === 'number' ? item.calories : 0)}
          </Text>
          <Text style={styles.nutritionLabel}>cal</Text>
        </View>
        <View style={styles.nutritionDivider} />
        <View style={styles.nutritionItem}>
          <Feather name="activity" size={16} color="#3b82f6" />
          <Text style={styles.nutritionValue}>
            {typeof item.macros.protein === 'number' ? item.macros.protein.toFixed(1) : '0'}g
          </Text>
          <Text style={styles.nutritionLabel}>protein</Text>
        </View>
        <View style={styles.nutritionDivider} />
        <View style={styles.nutritionItem}>
          <Feather name="disc" size={16} color="#10b981" />
          <Text style={styles.nutritionValue}>
            {typeof item.macros.carbs === 'number' ? item.macros.carbs.toFixed(1) : '0'}g
          </Text>
          <Text style={styles.nutritionLabel}>carbs</Text>
        </View>
        <View style={styles.nutritionDivider} />
        <View style={styles.nutritionItem}>
          <Feather name="droplet" size={16} color="#8b5cf6" />
          <Text style={styles.nutritionValue}>
            {typeof item.macros.fat === 'number' ? item.macros.fat.toFixed(1) : '0'}g
          </Text>
          <Text style={styles.nutritionLabel}>fat</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButtonPrimary}
          onPress={() => handleQuickAdd(item)}
        >
          <Feather name="plus" size={18} color="#fff" />
          <Text style={styles.actionButtonPrimaryText}>Quick Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButtonSecondary}
          onPress={() => handleDeleteMeal(item.id)}
        >
          <Feather name="trash-2" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = createStyles(isDarkMode);

  if (favoriteMeals.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Favorites</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Feather name="heart" size={64} color={isDarkMode ? '#4b5563' : '#d1d5db'} />
          </View>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon on any meal to save it as a favorite
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/(tabs)' as any)}
          >
            <Feather name="home" size={20} color="#10b981" />
            <Text style={styles.emptyButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[styles.sortButton, activeTab === 'recent' && styles.sortButtonActive]}
            onPress={() => setActiveTab('recent')}
          >
            <Feather 
              name="clock" 
              size={16} 
              color={activeTab === 'recent' ? '#10b981' : '#9ca3af'} 
            />
            <Text style={[styles.sortText, activeTab === 'recent' && styles.sortTextActive]}>
              Recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, activeTab === 'calories' && styles.sortButtonActive]}
            onPress={() => setActiveTab('calories')}
          >
            <Feather 
              name="bar-chart-2" 
              size={16} 
              color={activeTab === 'calories' ? '#10b981' : '#9ca3af'} 
            />
            <Text style={[styles.sortText, activeTab === 'calories' && styles.sortTextActive]}>
              Calories
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'recent' ? (
        <>
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Feather name="heart" size={18} color="#ef4444" />
              <Text style={styles.statValue}>{favoriteMeals.length}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Feather name="clock" size={18} color="#3b82f6" />
              <Text style={styles.statValue}>
                {recentFavorites.length > 0 
                  ? new Date(recentFavorites[0].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'N/A'
                }
              </Text>
              <Text style={styles.statLabel}>Latest</Text>
            </View>
          </View>

          <FlatList
            data={recentFavorites}
            renderItem={renderFavoriteMeal}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <Text style={styles.sectionSubtitle}>
                Your favorite meals sorted by most recent
              </Text>
            )}
          />
        </>
      ) : (
        <>
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Feather name="trending-down" size={18} color="#10b981" />
              <Text style={styles.statValue}>{calorieRanges.low.length}</Text>
              <Text style={styles.statLabel}>Low Cal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Feather name="minus" size={18} color="#f59e0b" />
              <Text style={styles.statValue}>{calorieRanges.medium.length}</Text>
              <Text style={styles.statLabel}>Medium</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Feather name="trending-up" size={18} color="#ef4444" />
              <Text style={styles.statValue}>{calorieRanges.high.length}</Text>
              <Text style={styles.statLabel}>High Cal</Text>
            </View>
          </View>

          <FlatList
            data={[
              { title: 'Low Calorie (≤300 cal)', meals: calorieRanges.low, color: '#10b981' },
              { title: 'Medium Calorie (301-600 cal)', meals: calorieRanges.medium, color: '#f59e0b' },
              { title: 'High Calorie (>600 cal)', meals: calorieRanges.high, color: '#ef4444' },
            ]}
            renderItem={({ item }) => (
              <>
                {item.meals.length > 0 && (
                  <View style={styles.calorieSection}>
                    <View style={styles.calorieSectionHeader}>
                      <View style={[styles.calorieBadge, { backgroundColor: item.color + '20' }]}>
                        <View style={[styles.calorieDot, { backgroundColor: item.color }]} />
                        <Text style={[styles.calorieSectionTitle, { color: item.color }]}>
                          {item.title}
                        </Text>
                      </View>
                      <Text style={styles.calorieSectionCount}>{item.meals.length} meals</Text>
                    </View>
                    {item.meals.map((meal) => (
                      <View key={meal.id}>
                        {renderFavoriteMeal({ item: meal })}
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
            keyExtractor={(item) => item.title}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <Text style={styles.sectionSubtitle}>
                Favorites organized by calorie content
              </Text>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

function getMealTypeIcon(type: string): keyof typeof Feather.glyphMap {
  switch (type) {
    case 'Breakfast':
      return 'sunrise';
    case 'Lunch':
      return 'sun';
    case 'Dinner':
      return 'moon';
    case 'Snack':
      return 'coffee';
    default:
      return 'circle';
  }
}

function getMealTypeStyle(type: string) {
  switch (type) {
    case 'Breakfast':
      return { backgroundColor: '#fbbf24' };
    case 'Lunch':
      return { backgroundColor: '#fb923c' };
    case 'Dinner':
      return { backgroundColor: '#6366f1' };
    case 'Snack':
      return { backgroundColor: '#8b5cf6' };
    default:
      return { backgroundColor: '#6b7280' };
  }
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#111827' : '#f9fafb',
  },
  header: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    gap: 6,
  },
  sortButtonActive: {
    backgroundColor: '#10b981',
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  sortTextActive: {
    color: '#fff',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  calorieSection: {
    marginBottom: 24,
  },
  calorieSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calorieBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  calorieDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  calorieSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  calorieSectionCount: {
    fontSize: 13,
    color: isDark ? '#6b7280' : '#9ca3af',
    fontWeight: '600',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1f2937' : '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  statLabel: {
    fontSize: 13,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  mealCard: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  mealTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 16,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    lineHeight: 18,
  },
  favoriteButton: {
    padding: 4,
  },
  nutritionRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: isDark ? '#374151' : '#f3f4f6',
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  nutritionLabel: {
    fontSize: 11,
    color: isDark ? '#6b7280' : '#9ca3af',
  },
  nutritionDivider: {
    width: 1,
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  actionButtonSecondary: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#7f1d1d33' : '#fef2f2',
    borderRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#10b98133' : '#f0fdf4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10b981',
  },
});
