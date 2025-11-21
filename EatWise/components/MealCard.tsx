/**
 * MealCard Component
 * Displays individual meal information in a card format
 */

import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

interface MealCardProps {
  id: string;
  mealType: MealType;
  description: string;
  calories: number;
  timestamp: string; // ISO date string
  onPress: () => void;
}

const getMealIcon = (mealType: MealType): keyof typeof Feather.glyphMap => {
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

const getMealColor = (mealType: MealType): string => {
  switch (mealType) {
    case 'Breakfast':
      return '#f59e0b'; // amber
    case 'Lunch':
      return '#10b981'; // emerald
    case 'Dinner':
      return '#6366f1'; // indigo
    case 'Snack':
      return '#ec4899'; // pink
    default:
      return '#6b7280';
  }
};

export const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function MealCard({
  mealType,
  description,
  calories,
  timestamp,
  onPress,
}: MealCardProps) {
  const iconName = getMealIcon(mealType);
  const color = getMealColor(mealType);
  const timeString = formatTime(timestamp);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Feather name={iconName} size={28} color={color} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.mealType}>{mealType}</Text>
          <Text style={styles.time}>{timeString}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.caloriesBadge}>
            <Feather name="zap" size={14} color="#10b981" />
            <Text style={styles.calories}>{Math.round(calories)} cal</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9ca3af" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  mealType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  time: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caloriesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  calories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 4,
  },
});
