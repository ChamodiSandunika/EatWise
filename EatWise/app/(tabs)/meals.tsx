/**
 * Meals Tab Screen
 * Placeholder screen for the Add Meal tab
 * Actual navigation handled by tab listener in _layout.tsx
 */

import React from 'react';
import { View } from 'react-native';

export default function MealsScreen() {
  // This screen is never shown because the tab listener
  // redirects to /add-meal before this renders
  return <View />;
}
