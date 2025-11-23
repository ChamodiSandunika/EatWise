/**
 * AdviceCard Component
 * Displays a single health advice message with icon and styling
 */

import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AdviceMessage } from '../utils/adviceEngine';

interface AdviceCardProps {
  advice: AdviceMessage;
}

export default function AdviceCard({ advice }: AdviceCardProps) {
  const getBackgroundColor = () => {
    switch (advice.type) {
      case 'warning':
        return '#fef2f2';
      case 'tip':
        return '#eff6ff';
      case 'positive':
        return '#f0fdf4';
      case 'info':
        return '#fefce8';
      default:
        return '#f9fafb';
    }
  };

  const getBorderColor = () => {
    switch (advice.type) {
      case 'warning':
        return '#fecaca';
      case 'tip':
        return '#bfdbfe';
      case 'positive':
        return '#bbf7d0';
      case 'info':
        return '#fef08a';
      default:
        return '#e5e7eb';
    }
  };

  const getIconColor = () => {
    switch (advice.type) {
      case 'warning':
        return '#ef4444';
      case 'tip':
        return '#3b82f6';
      case 'positive':
        return '#10b981';
      case 'info':
        return '#eab308';
      default:
        return '#6b7280';
    }
  };

  const getTypeLabel = () => {
    switch (advice.type) {
      case 'warning':
        return 'Warning';
      case 'tip':
        return 'Tip';
      case 'positive':
        return 'Great Job';
      case 'info':
        return 'Info';
      default:
        return 'Advice';
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
          <Feather name={advice.icon as any} size={20} color={getIconColor()} />
        </View>
        <Text style={[styles.typeLabel, { color: getIconColor() }]}>
          {getTypeLabel()}
        </Text>
      </View>
      <Text style={styles.message}>{advice.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    fontWeight: '500',
  },
});
