/**
 * Meals Screen (Placeholder)
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function MealsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Meal</Text>
      </View>
      <View style={styles.content}>
        <Feather name="plus-circle" size={64} color="#d1d5db" />
        <Text style={styles.title}>Add Meal</Text>
        <Text style={styles.subtitle}>Track your meals and calories</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
});
