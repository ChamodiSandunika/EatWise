/**
 * Profile Screen
 * Displays user information and logout functionality with Clerk
 */

import { useAuth, useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();

  /**
   * Handle user logout with Clerk
   * Clears session and navigates to sign-in screen
   */
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/sign-in');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>

          <Text style={styles.username}>
            {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Guest User'}
          </Text>
          <Text style={styles.email}>
            {user?.emailAddresses?.[0]?.emailAddress || 'guest@eatwise.com'}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="user" size={20} color="#374151" />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="bell" size={20} color="#374151" />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="lock" size={20} color="#374151" />
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="globe" size={20} color="#374151" />
              <Text style={styles.menuItemText}>Language</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>English</Text>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="moon" size={20} color="#374151" />
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>Off</Text>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="info" size={20} color="#374151" />
              <Text style={styles.menuItemText}>About EatWise</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="help-circle" size={20} color="#374151" />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="file-text" size={20} color="#374151" />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
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
  userCard: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 32,
  },
});
