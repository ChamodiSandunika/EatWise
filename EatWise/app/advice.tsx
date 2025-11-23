/**
 * Smart Health Advice Screen
 * Analyzes user's meal data and provides personalized health recommendations
 */

import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import AdviceCard from '../components/AdviceCard';
import {
    selectDailyCalories,
    selectDailyGoal,
    selectDailyMacros,
    selectSugarAndSodiumTotals,
    selectTodaysMealCount,
    selectTodaysMeals,
} from '../store/mealsSelectors';
import {
    analyzeDay,
    getMotivationalMessage,
    type NutritionTotals,
} from '../utils/adviceEngine';

export default function AdviceScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  // Get data from Redux
  const todaysMeals = useSelector(selectTodaysMeals);
  const dailyCalories = useSelector(selectDailyCalories);
  const dailyGoal = useSelector(selectDailyGoal);
  const dailyMacros = useSelector(selectDailyMacros);
  const sugarAndSodium = useSelector(selectSugarAndSodiumTotals);
  const mealCount = useSelector(selectTodaysMealCount);

  // Combine nutrition totals
  const nutritionTotals: NutritionTotals = {
    calories: dailyCalories,
    protein: dailyMacros.protein,
    carbs: dailyMacros.carbs,
    fat: dailyMacros.fat,
    sugar: sugarAndSodium.sugar,
    sodium: sugarAndSodium.sodium,
  };

  // Analyze and generate advice
  const { advice } = analyzeDay(todaysMeals, dailyGoal);
  const motivationalMessage = getMotivationalMessage(
    nutritionTotals,
    dailyGoal,
    mealCount
  );

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 500);
  };

  const caloriePercent = Math.min((dailyCalories / dailyGoal) * 100, 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Advice</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981"
            colors={['#10b981']}
          />
        }
      >
        {/* Motivational Banner */}
        <View style={styles.motivationalBanner}>
          <View style={styles.motivationalIconContainer}>
            <Feather name="heart" size={32} color="#10b981" />
          </View>
          <Text style={styles.motivationalText}>{motivationalMessage}</Text>
        </View>

        {/* Today's Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Feather name="bar-chart-2" size={24} color="#3b82f6" />
            <Text style={styles.summaryTitle}>Today's Nutrition Summary</Text>
          </View>

          {/* Calories Progress */}
          <View style={styles.caloriesSection}>
            <View style={styles.caloriesRow}>
              <Text style={styles.caloriesLabel}>Calories</Text>
              <Text style={styles.caloriesValue}>
                {Math.round(dailyCalories)} / {dailyGoal}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${caloriePercent}%`,
                    backgroundColor:
                      caloriePercent > 100
                        ? '#ef4444'
                        : caloriePercent > 80
                        ? '#f59e0b'
                        : '#10b981',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(caloriePercent)}% of daily goal</Text>
          </View>

          {/* Macros Grid */}
          <View style={styles.macrosGrid}>
            <View style={styles.macroItem}>
              <View style={[styles.macroIcon, { backgroundColor: '#dbeafe' }]}>
                <Feather name="activity" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.macroValue}>{nutritionTotals.protein.toFixed(1)}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroIcon, { backgroundColor: '#fef3c7' }]}>
                <Feather name="pie-chart" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.macroValue}>{nutritionTotals.carbs.toFixed(1)}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroIcon, { backgroundColor: '#fce7f3' }]}>
                <Feather name="droplet" size={20} color="#ec4899" />
              </View>
              <Text style={styles.macroValue}>{nutritionTotals.fat.toFixed(1)}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>

          {/* Sugar & Sodium */}
          <View style={styles.extraNutrients}>
            <View style={styles.extraNutrientItem}>
              <Feather name="box" size={16} color="#8b5cf6" />
              <Text style={styles.extraNutrientLabel}>Sugar:</Text>
              <Text style={styles.extraNutrientValue}>{nutritionTotals.sugar.toFixed(1)}g</Text>
            </View>
            <View style={styles.extraNutrientItem}>
              <Feather name="droplet" size={16} color="#06b6d4" />
              <Text style={styles.extraNutrientLabel}>Sodium:</Text>
              <Text style={styles.extraNutrientValue}>{Math.round(nutritionTotals.sodium)}mg</Text>
            </View>
          </View>
        </View>

        {/* Advice Section */}
        <View style={styles.adviceSection}>
          <View style={styles.adviceSectionHeader}>
            <Feather name="compass" size={22} color="#10b981" />
            <Text style={styles.adviceSectionTitle}>Personalized Health Advice</Text>
          </View>

          {advice.length > 0 ? (
            <>
              <Text style={styles.adviceCount}>
                {advice.length} recommendation{advice.length !== 1 ? 's' : ''} for you
              </Text>
              {advice.map((item) => (
                <AdviceCard key={item.id} advice={item} />
              ))}
            </>
          ) : (
            <View style={styles.noAdviceContainer}>
              <Feather name="check-circle" size={48} color="#10b981" />
              <Text style={styles.noAdviceTitle}>All Good!</Text>
              <Text style={styles.noAdviceText}>
                Your nutrition looks balanced. Keep up the great work!
              </Text>
            </View>
          )}
        </View>

        {/* Info Footer */}
        <View style={styles.infoFooter}>
          <Feather name="info" size={16} color="#9ca3af" />
          <Text style={styles.infoText}>
            Advice is based on WHO nutrition guidelines and your logged meals
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
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
    fontWeight: '700',
    color: '#1f2937',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  motivationalBanner: {
    backgroundColor: '#f0fdf4',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  motivationalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  motivationalText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    lineHeight: 24,
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  caloriesSection: {
    marginBottom: 20,
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  caloriesLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  caloriesValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  macroIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  macroLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  extraNutrients: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  extraNutrientItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
  },
  extraNutrientLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  extraNutrientValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '700',
  },
  adviceSection: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  adviceSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  adviceSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  adviceCount: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  noAdviceContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  noAdviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noAdviceText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 32,
  },
});
