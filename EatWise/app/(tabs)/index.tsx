/**
 * Home Screen
 * Displays daily meal log and calorie tracking
 * Uses Redux for state management, no direct API calls
 */

import { useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import DailySummary from '../../components/DailySummary';
import MealCard from '../../components/MealCard';
import { useTheme } from '../../contexts/ThemeContext';
import {
    selectDailyCalories,
    selectDailyGoal,
    selectIsLoading,
    selectTodaysMealCount,
    selectTodaysMeals,
} from '../../store/mealsSelectors';
import type { Meal } from '../../store/mealsSlice';
import { loadMealsFromStorage, toggleFavorite } from '../../store/mealsSlice';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();

  // Redux selectors
  const todaysMeals = useSelector(selectTodaysMeals);
  const dailyCalories = useSelector(selectDailyCalories);
  const dailyGoal = useSelector(selectDailyGoal);
  const mealCount = useSelector(selectTodaysMealCount);
  const isLoading = useSelector(selectIsLoading);

  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Load profile picture from storage (reload on focus)
  useFocusEffect(
    useCallback(() => {
      const loadProfilePicture = async () => {
        try {
          const savedPicture = await AsyncStorage.getItem('@eatwise_profile_pic');
          // Update state regardless - if null, it means the picture was removed
          setProfilePicture(savedPicture);
        } catch (error) {
          console.error('Error loading profile picture:', error);
          setProfilePicture(null);
        }
      };
      loadProfilePicture();
    }, [])
  );

  // Sample notifications
  const notifications = [
    {
      id: '1',
      title: 'Daily Goal Reminder',
      message: `You're doing great! You've consumed ${Math.round(dailyCalories)} out of ${dailyGoal} calories today. Keep it up!`,
      time: '2 hours ago',
      icon: 'target' as const,
      color: '#10b981',
      read: false,
    },
    {
      id: '2',
      title: 'Meal Logged Successfully',
      message: 'Your breakfast has been added to today\'s meal log. You\'re making great progress!',
      time: '5 hours ago',
      icon: 'check-circle' as const,
      color: '#3b82f6',
      read: false,
    },
    {
      id: '3',
      title: 'Water Intake Reminder',
      message: 'Don\'t forget to stay hydrated! Aim for at least 8 glasses of water today.',
      time: '1 day ago',
      icon: 'droplet' as const,
      color: '#06b6d4',
      read: false,
    },
  ];

  // Load meals from storage on mount
  useEffect(() => {
    dispatch(loadMealsFromStorage() as any);
  }, [dispatch]);

  // Debug logging
  useEffect(() => {
    console.log('🏠 Home Screen - Today\'s Meals:', todaysMeals.length);
    console.log('🏠 Home Screen - Daily Calories:', dailyCalories);
    console.log('🏠 Home Screen - Daily Goal:', dailyGoal);
    if (todaysMeals.length > 0) {
      console.log('🏠 First meal data:', JSON.stringify(todaysMeals[0], null, 2));
    }
  }, [todaysMeals, dailyCalories, dailyGoal]);

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
      isFavorite={item.isFavorite}
      isDarkMode={isDarkMode}
      onPress={() => handleMealPress(item)}
      onToggleFavorite={() => dispatch(toggleFavorite(item.id))}
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
        onPress={() => router.push('/add-meal')}
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
        isDarkMode={isDarkMode}
      />

      {/* Health Advice Button */}
      <TouchableOpacity
        style={styles.adviceButton}
        onPress={() => router.push('/advice')}
        activeOpacity={0.7}
      >
        <View style={styles.adviceButtonLeft}>
          <View style={styles.adviceIconContainer}>
            <Feather name="heart" size={24} color="#10b981" />
          </View>
          <View>
            <Text style={styles.adviceButtonTitle}>Smart Health Advice</Text>
            <Text style={styles.adviceButtonSubtitle}>
              Get personalized nutrition insights
            </Text>
          </View>
        </View>
        <Feather name="arrow-right" size={20} color={isDarkMode ? '#6b7280' : '#9ca3af'} />
      </TouchableOpacity>

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

  // Get dynamic styles based on theme
  const styles = createStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1f2937' : '#fff'}
      />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/profile' as any)}>
            {profilePicture || user?.imageUrl ? (
              <Image
                source={{ uri: profilePicture || user?.imageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Feather name="user" size={24} color="#9ca3af" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.username}>{displayName}!</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Feather 
              name={isDarkMode ? 'sun' : 'moon'} 
              size={22} 
              color={isDarkMode ? '#fbbf24' : '#1f2937'} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {
              console.log('🔔 Bell clicked, showing notifications');
              setShowNotifications(true);
            }}
            activeOpacity={0.7}
          >
            <Feather name="bell" size={24} color={isDarkMode ? '#f9fafb' : '#1f2937'} />
            {notifications.filter(n => !n.read).length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notifications.filter(n => !n.read).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
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
        onPress={() => router.push('/add-meal')}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotifications(false)}
        statusBarTranslucent
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowNotifications(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity
                onPress={() => setShowNotifications(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Notifications List */}
            <ScrollView
              style={styles.notificationsList}
              contentContainerStyle={styles.notificationsListContent}
              showsVerticalScrollIndicator={true}
              bounces={true}
            >
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={styles.notificationItem}
                    activeOpacity={0.7}
                    onPress={() => console.log('Notification clicked:', notification.id)}
                  >
                    <View style={[styles.notificationIcon, { backgroundColor: `${notification.color}20` }]}>
                      <Feather name={notification.icon} size={24} color={notification.color} />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyNotifications}>
                  <Feather name="bell-off" size={48} color="#d1d5db" />
                  <Text style={styles.emptyNotificationsText}>No notifications yet</Text>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#111827' : '#f9fafb',
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
    backgroundColor: isDark ? '#1f2937' : '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  profileImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  greetingContainer: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
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
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 48,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#9ca3af',
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
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  adviceButton: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: isDark ? '#10b981' : '#dcfce7',
  },
  adviceButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  adviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? '#10b98133' : '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adviceButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  adviceButtonSubtitle: {
    fontSize: 13,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginTop: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: isDark ? '#374151' : '#fff',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
    marginTop: 60,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsListContent: {
    padding: 16,
    paddingBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#111827' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginLeft: 8,
  },
  emptyNotifications: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyNotificationsText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 16,
  },
});
