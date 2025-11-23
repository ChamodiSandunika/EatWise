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
  isFavorite?: boolean;
  isDarkMode?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
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
  isFavorite = false,
  isDarkMode = false,
  onPress,
  onToggleFavorite,
}: MealCardProps) {
  console.log('🎴 MealCard - Received calories:', calories, 'Type:', typeof calories, 'Meal:', mealType);
  
  const iconName = getMealIcon(mealType);
  const color = getMealColor(mealType);
  const timeString = formatTime(timestamp);
  const styles = createStyles(isDarkMode);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Feather name={iconName} size={28} color={color} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.mealType}>{mealType}</Text>
          <View style={styles.headerRight}>
            {onToggleFavorite && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                style={styles.favoriteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather
                  name={isFavorite ? 'heart' : 'heart'}
                  size={20}
                  color={isFavorite ? '#ef4444' : '#d1d5db'}
                  fill={isFavorite ? '#ef4444' : 'none'}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.time}>{timeString}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.caloriesBadge}>
            <Feather name="zap" size={14} color="#10b981" />
            <Text style={styles.calories}>
              {Math.round(typeof calories === 'number' ? calories : 0)} cal
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9ca3af" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#f3f4f6',
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    padding: 2,
  },
  mealType: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  time: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
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
    backgroundColor: isDark ? '#10b98133' : '#f0fdf4',
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
