/**
 * Profile Screen
 * Complete user profile with stats, goal management, and settings
 */

import { useAuth, useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../../contexts/ThemeContext';

import {
    selectDailyCalories,
    selectDailyGoal,
    selectTodaysMealCount,
    selectTodaysMeals,
} from '../../store/mealsSelectors';
import { clearMeals, loadDailyGoalFromStorage, setDailyGoal } from '../../store/mealsSlice';

const PROFILE_PIC_KEY = '@eatwise_profile_pic';
const USER_DATA_KEY = '@eatwise_user_data';

interface UserData {
  displayName: string;
  profilePicture: string | null;
}

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { isDarkMode } = useTheme();

  // Redux selectors
  const todaysMeals = useSelector(selectTodaysMeals);
  const dailyCalories = useSelector(selectDailyCalories);
  const dailyGoal = useSelector(selectDailyGoal);
  const mealCount = useSelector(selectTodaysMealCount);

  // Local state
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState(dailyGoal.toString());
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');

  // Load user data on mount
  useEffect(() => {
    loadUserData();
    dispatch(loadDailyGoalFromStorage() as any);
  }, []);

  // Set initial display name from Clerk
  useEffect(() => {
    if (user) {
      const name =
        user.firstName ||
        user.username ||
        user.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
        'User';
      setDisplayName(name);
      setEditName(name);
    }
  }, [user]);

  // Load profile picture and custom data from AsyncStorage
  const loadUserData = async () => {
    try {
      const [picUri, userData] = await Promise.all([
        AsyncStorage.getItem(PROFILE_PIC_KEY),
        AsyncStorage.getItem(USER_DATA_KEY),
      ]);

      if (picUri) {
        setProfilePicture(picUri);
      }

      if (userData) {
        const parsed: UserData = JSON.parse(userData);
        if (parsed.displayName) {
          setDisplayName(parsed.displayName);
          setEditName(parsed.displayName);
        }
        if (parsed.profilePicture) {
          setProfilePicture(parsed.profilePicture);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Save user data to AsyncStorage
  const saveUserData = async (data: UserData) => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to upload a profile picture'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setProfilePicture(uri);
        await AsyncStorage.setItem(PROFILE_PIC_KEY, uri);
        await saveUserData({ displayName, profilePicture: uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Remove profile picture
  const removeProfilePicture = async () => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove your profile picture?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          setProfilePicture(null);
          await AsyncStorage.removeItem(PROFILE_PIC_KEY);
          await saveUserData({ displayName, profilePicture: null });
        },
      },
    ]);
  };

  // Update daily goal
  const updateGoal = () => {
    const goal = parseInt(newGoal, 10);
    if (isNaN(goal) || goal < 500 || goal > 10000) {
      Alert.alert('Invalid Goal', 'Please enter a goal between 500 and 10,000 calories');
      return;
    }

    dispatch(setDailyGoal(goal));
    setShowGoalModal(false);
    Alert.alert('Success', 'Daily calorie goal updated!');
  };

  // Update display name
  const updateDisplayName = async () => {
    if (editName.trim().length < 2) {
      Alert.alert('Invalid Name', 'Please enter a name with at least 2 characters');
      return;
    }

    setDisplayName(editName.trim());
    await saveUserData({ displayName: editName.trim(), profilePicture });
    setShowEditModal(false);
    Alert.alert('Success', 'Profile updated!');
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            // Clear AsyncStorage
            await AsyncStorage.multiRemove([
              '@eatwise_meals',
              '@eatwise_goal',
              PROFILE_PIC_KEY,
              USER_DATA_KEY,
            ]);

            // Clear Redux
            dispatch(clearMeals());

            // Sign out from Clerk
            await signOut();
            router.replace('/sign-in');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  const remainingCalories = dailyGoal - dailyCalories;
  const username = user?.firstName || user?.username || displayName || 'User';
  const email = user?.emailAddresses?.[0]?.emailAddress || 'guest@eatwise.com';
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const styles = createStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Feather name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>

          {profilePicture && (
            <TouchableOpacity style={styles.removePhotoButton} onPress={removeProfilePicture}>
              <Text style={styles.removePhotoText}>Remove Photo</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.profileName}>{username}</Text>
          <Text style={styles.profileEmail}>{email}</Text>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setShowEditModal(true)}
          >
            <Feather name="edit-2" size={16} color="#10b981" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Feather name="pie-chart" size={24} color="#10b981" />
                <Text style={styles.statValue}>{mealCount}</Text>
                <Text style={styles.statLabel}>Meals Logged</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Feather name="activity" size={24} color="#f59e0b" />
                <Text style={styles.statValue}>{dailyCalories}</Text>
                <Text style={styles.statLabel}>Calories Consumed</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Feather name="target" size={24} color="#3b82f6" />
                <Text style={styles.statValue}>{remainingCalories >= 0 ? remainingCalories : 0}</Text>
                <Text style={styles.statLabel}>Remaining</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Daily Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Calorie Goal</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalLeft}>
              <Feather name="zap" size={32} color="#10b981" />
              <View style={styles.goalInfo}>
                <Text style={styles.goalValue}>{dailyGoal} cal</Text>
                <Text style={styles.goalLabel}>Daily Target</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editGoalButton}
              onPress={() => {
                setNewGoal(dailyGoal.toString());
                setShowGoalModal(true);
              }}
            >
              <Feather name="edit-3" size={18} color="#10b981" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((dailyCalories / dailyGoal) * 100, 100)}%`,
                    backgroundColor: dailyCalories > dailyGoal ? '#ef4444' : '#10b981',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {dailyCalories} / {dailyGoal} cal (
              {Math.round((dailyCalories / dailyGoal) * 100)}%)
            </Text>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/meal-history')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#dbeafe' }]}>
                <Feather name="clock" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.menuItemText}>Meal History</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/notifications')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#fef3c7' }]}>
                <Feather name="bell" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/privacy')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#fce7f3' }]}>
                <Feather name="shield" size={20} color="#ec4899" />
              </View>
              <Text style={styles.menuItemText}>Privacy & Security</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/help')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#ede9fe' }]}>
                <Feather name="help-circle" size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>EatWise v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with ❤️ for healthy living</Text>
        </View>
      </ScrollView>

      {/* Edit Goal Modal */}
      <Modal
        visible={showGoalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Daily Goal</Text>
            <Text style={styles.modalSubtitle}>
              Set your daily calorie target (500 - 10,000 cal)
            </Text>

            <TextInput
              style={styles.modalInput}
              value={newGoal}
              onChangeText={setNewGoal}
              keyboardType="number-pad"
              placeholder="e.g., 2000"
              maxLength={5}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButtonSave} onPress={updateGoal}>
                <Text style={styles.modalButtonSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Text style={styles.modalSubtitle}>Update your display name</Text>

            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Display Name"
              maxLength={50}
            />

            <Text style={styles.modalNote}>
              Email is managed by your account provider and cannot be changed here.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButtonSave} onPress={updateDisplayName}>
                <Text style={styles.modalButtonSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#111827' : '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  profileCard: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: isDark ? '#1f2937' : '#fff',
  },
  removePhotoButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  removePhotoText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: isDark ? '#10b98133' : '#f0fdf4',
    borderRadius: 20,
    gap: 6,
  },
  editProfileText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
    marginHorizontal: 12,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  goalInfo: {
    gap: 4,
  },
  goalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  goalLabel: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  editGoalButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? '#10b98133' : '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderRadius: 12,
    padding: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 13,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#1f2937' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#1f2937' : '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: isDark ? '#7f1d1d' : '#fee2e2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: isDark ? '#6b7280' : '#9ca3af',
  },
  footerSubtext: {
    fontSize: 11,
    color: isDark ? '#4b5563' : '#d1d5db',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: isDark ? '#374151' : '#f9fafb',
    borderWidth: 1,
    borderColor: isDark ? '#4b5563' : '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 20,
  },
  modalNote: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  modalButtonSave: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
  },
  modalButtonSaveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
