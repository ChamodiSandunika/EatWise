/**
 * Daily Summary Component
 * Displays daily calorie intake with progress bar
 */

import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DailySummaryProps {
  totalCalories: number;
  dailyGoal: number;
  mealCount: number;
}

export default function DailySummary({
  totalCalories,
  dailyGoal,
  mealCount,
}: DailySummaryProps) {
  console.log('📊 DailySummary - Received totalCalories:', totalCalories, 'Type:', typeof totalCalories);
  console.log('📊 DailySummary - Received dailyGoal:', dailyGoal);
  console.log('📊 DailySummary - Received mealCount:', mealCount);
  
  const progress = Math.min((totalCalories / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - totalCalories, 0);
  const isOverGoal = totalCalories > dailyGoal;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Intake</Text>
        <View style={styles.mealCountBadge}>
          <Feather name="coffee" size={14} color="#10b981" />
          <Text style={styles.mealCountText}>{mealCount} meals</Text>
        </View>
      </View>

      <View style={styles.caloriesRow}>
        <View style={styles.caloriesInfo}>
          <Text style={styles.caloriesValue}>{Math.round(totalCalories)}</Text>
          <Text style={styles.caloriesLabel}>consumed</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.caloriesInfo}>
          <Text style={[styles.caloriesValue, isOverGoal && styles.overGoalText]}>
            {Math.round(remaining)}
          </Text>
          <Text style={styles.caloriesLabel}>
            {isOverGoal ? 'over' : 'remaining'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.caloriesInfo}>
          <Text style={styles.goalValue}>{Math.round(dailyGoal)}</Text>
          <Text style={styles.caloriesLabel}>goal</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: isOverGoal ? '#ef4444' : '#10b981',
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      {/* Macros Preview */}
      <View style={styles.macrosHint}>
        <Feather name="info" size={14} color="#6b7280" />
        <Text style={styles.macrosHintText}>
          Tap a meal to see detailed nutrition
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  mealCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  mealCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  caloriesInfo: {
    alignItems: 'center',
  },
  caloriesValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  goalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
  },
  overGoalText: {
    color: '#ef4444',
  },
  caloriesLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    minWidth: 40,
    textAlign: 'right',
  },
  macrosHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 6,
  },
  macrosHintText: {
    fontSize: 13,
    color: '#6b7280',
  },
});
