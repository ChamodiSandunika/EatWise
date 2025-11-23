/**
 * Debug Screen - Check Stored Meals Data
 * Run this to see what's actually stored in AsyncStorage
 */

import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { clearAllMeals, migrateMeals } from '../utils/migrateMeals';

export default function DebugScreen() {
  const router = useRouter();
  const [mealsData, setMealsData] = useState<string>('Loading...');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const meals = await AsyncStorage.getItem('@eatwise_meals');
      if (meals) {
        const parsed = JSON.parse(meals);
        setMealsData(JSON.stringify(parsed, null, 2));
        
        console.log('🔍 DEBUG - Stored Meals:', parsed);
        console.log('🔍 DEBUG - First Meal:', parsed[0]);
        if (parsed[0]) {
          console.log('🔍 DEBUG - First Meal Calories:', parsed[0].calories);
          console.log('🔍 DEBUG - First Meal Type:', typeof parsed[0].calories);
        }
      } else {
        setMealsData('No meals stored');
      }
    } catch (error) {
      setMealsData(`Error: ${error}`);
    }
  };

  const handleMigration = async () => {
    Alert.alert(
      'Fix Meal Data',
      'This will recalculate calories for all meals with missing data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Fix Now',
          onPress: async () => {
            try {
              setIsProcessing(true);
              const result = await migrateMeals();
              Alert.alert(
                'Success',
                `Fixed ${result.fixed} of ${result.total} meals. Please restart the app to see changes.`
              );
              await loadStorageData();
            } catch (error) {
              Alert.alert('Error', `Migration failed: ${error}`);
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const clearStorage = async () => {
    Alert.alert(
      'Clear All Meals',
      'This will delete ALL meal data. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await clearAllMeals();
              setMealsData('Storage cleared');
              await loadStorageData();
              Alert.alert('Success', 'All meals deleted');
            } catch (error) {
              Alert.alert('Error', `Failed to clear: ${error}`);
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Debug Storage</Text>
        <TouchableOpacity onPress={clearStorage} style={styles.trashButton}>
          <Feather name="trash-2" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.label}>Stored Meals Data:</Text>
        <View style={styles.dataBox}>
          <Text style={styles.dataText}>{mealsData}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.refreshButton, isProcessing && styles.disabledButton]} 
          onPress={loadStorageData}
          disabled={isProcessing}
        >
          <Feather name="refresh-cw" size={20} color="#fff" />
          <Text style={styles.refreshText}>Refresh Data</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.fixButton, isProcessing && styles.disabledButton]} 
          onPress={handleMigration}
          disabled={isProcessing}
        >
          <Feather name="tool" size={20} color="#fff" />
          <Text style={styles.fixText}>Fix Meal Calories</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.clearButton, isProcessing && styles.disabledButton]} 
          onPress={clearStorage}
          disabled={isProcessing}
        >
          <Feather name="trash-2" size={20} color="#fff" />
          <Text style={styles.clearText}>Clear All Meals</Text>
        </TouchableOpacity>

        {isProcessing && (
          <Text style={styles.processingText}>Processing...</Text>
        )}
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  trashButton: {
    padding: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  dataBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  dataText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#374151',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  fixButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  fixText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
  processingText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
});
