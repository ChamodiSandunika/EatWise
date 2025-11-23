import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../contexts/ThemeContext';

const NOTIFICATION_SETTINGS_KEY = '@eatwise_notification_settings';

interface NotificationSettings {
  mealReminders: boolean;
  dailyGoalReminders: boolean;
  weeklyReports: boolean;
  nutritionTips: boolean;
  breakfastReminder: boolean;
  lunchReminder: boolean;
  dinnerReminder: boolean;
  waterReminder: boolean;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  goalAlerts: boolean;
  motivationalMessages: boolean;
}

const defaultSettings: NotificationSettings = {
  mealReminders: true,
  dailyGoalReminders: true,
  weeklyReports: false,
  nutritionTips: true,
  breakfastReminder: true,
  lunchReminder: true,
  dinnerReminder: true,
  waterReminder: true,
  breakfastTime: '08:00',
  lunchTime: '12:30',
  dinnerTime: '19:00',
  goalAlerts: true,
  motivationalMessages: false,
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      Alert.alert('Error', 'Failed to save notification settings');
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleTimeChange = (key: 'breakfastTime' | 'lunchTime' | 'dinnerTime') => {
    Alert.alert(
      'Set Time',
      `This feature would open a time picker to set ${key.replace('Time', '')} reminder time.`,
      [{ text: 'OK' }]
    );
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'Are you sure you want to reset all notification settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => saveSettings(defaultSettings),
        },
      ]
    );
  };

  const styles = createStyles(isDarkMode);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={isDarkMode ? '#f9fafb' : '#1f2937'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={isDarkMode ? '#f9fafb' : '#1f2937'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* General Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Notifications</Text>
          <Text style={styles.sectionDescription}>
            Manage your notification preferences
          </Text>

          <View style={styles.card}>
            <SettingItem
              icon="bell"
              iconBg="#3b82f6"
              title="Meal Reminders"
              description="Get reminded to log your meals"
              value={settings.mealReminders}
              onToggle={() => toggleSetting('mealReminders')}
              styles={styles}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="target"
              iconBg="#10b981"
              title="Daily Goal Reminders"
              description="Stay on track with your daily calorie goals"
              value={settings.dailyGoalReminders}
              onToggle={() => toggleSetting('dailyGoalReminders')}
              styles={styles}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="bar-chart-2"
              iconBg="#8b5cf6"
              title="Weekly Reports"
              description="Receive weekly progress summaries"
              value={settings.weeklyReports}
              onToggle={() => toggleSetting('weeklyReports')}
              styles={styles}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="book-open"
              iconBg="#f59e0b"
              title="Nutrition Tips"
              description="Learn with daily nutrition insights"
              value={settings.nutritionTips}
              onToggle={() => toggleSetting('nutritionTips')}
              styles={styles}
            />
          </View>
        </View>

        {/* Meal Time Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Time Reminders</Text>
          <Text style={styles.sectionDescription}>
            Set reminders for specific meal times
          </Text>

          <View style={styles.card}>
            <MealTimeItem
              icon="sunrise"
              iconBg="#fbbf24"
              title="Breakfast"
              time={settings.breakfastTime}
              enabled={settings.breakfastReminder}
              onToggle={() => toggleSetting('breakfastReminder')}
              onTimePress={() => handleTimeChange('breakfastTime')}
              styles={styles}
            />
            <View style={styles.divider} />
            <MealTimeItem
              icon="sun"
              iconBg="#fb923c"
              title="Lunch"
              time={settings.lunchTime}
              enabled={settings.lunchReminder}
              onToggle={() => toggleSetting('lunchReminder')}
              onTimePress={() => handleTimeChange('lunchTime')}
              styles={styles}
            />
            <View style={styles.divider} />
            <MealTimeItem
              icon="moon"
              iconBg="#6366f1"
              title="Dinner"
              time={settings.dinnerTime}
              enabled={settings.dinnerReminder}
              onToggle={() => toggleSetting('dinnerReminder')}
              onTimePress={() => handleTimeChange('dinnerTime')}
              styles={styles}
            />
          </View>
        </View>

        {/* Additional Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Reminders</Text>

          <View style={styles.card}>
            <SettingItem
              icon="droplet"
              iconBg="#06b6d4"
              title="Water Reminder"
              description="Stay hydrated throughout the day"
              value={settings.waterReminder}
              onToggle={() => toggleSetting('waterReminder')}
              styles={styles}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="alert-circle"
              iconBg="#ef4444"
              title="Goal Alerts"
              description="Get notified when approaching your daily limit"
              value={settings.goalAlerts}
              onToggle={() => toggleSetting('goalAlerts')}
              styles={styles}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="heart"
              iconBg="#ec4899"
              title="Motivational Messages"
              description="Receive daily motivation and encouragement"
              value={settings.motivationalMessages}
              onToggle={() => toggleSetting('motivationalMessages')}
              styles={styles}
            />
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={resetToDefaults}>
          <Feather name="refresh-cw" size={20} color="#ef4444" />
          <Text style={styles.resetText}>Reset to Defaults</Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Feather name="info" size={20} color="#6b7280" />
          <Text style={styles.infoText}>
            Notification settings are saved locally on your device. Make sure notifications
            are enabled in your device settings for the best experience.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface SettingItemProps {
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
  styles: any;
}

function SettingItem({ icon, iconBg, title, description, value, onToggle, styles }: SettingItemProps) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Feather name={icon} size={20} color="#fff" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#e5e7eb', true: '#86efac' }}
        thumbColor={value ? '#10b981' : '#f3f4f6'}
      />
    </View>
  );
}

interface MealTimeItemProps {
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  title: string;
  time: string;
  enabled: boolean;
  onToggle: () => void;
  onTimePress: () => void;
  styles: any;
}

function MealTimeItem({
  icon,
  iconBg,
  title,
  time,
  enabled,
  onToggle,
  onTimePress,
  styles,
}: MealTimeItemProps) {
  return (
    <View style={styles.mealTimeItem}>
      <View style={styles.mealTimeLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Feather name={icon} size={20} color="#fff" />
        </View>
        <View style={styles.mealTimeInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <TouchableOpacity onPress={onTimePress} disabled={!enabled}>
            <Text style={[styles.timeText, !enabled && styles.timeTextDisabled]}>{time}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: '#e5e7eb', true: '#86efac' }}
        thumbColor={enabled ? '#10b981' : '#f3f4f6'}
      />
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#111827' : '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#1f2937' : '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  backButton: {
    padding: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 12,
  },
  card: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#f9fafb' : '#1f2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    marginLeft: 68,
  },
  mealTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  mealTimeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  mealTimeInfo: {
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginTop: 2,
  },
  timeTextDisabled: {
    color: isDark ? '#6b7280' : '#9ca3af',
  },
  resetButton: {
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
  resetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: isDark ? '#9ca3af' : '#6b7280',
    lineHeight: 18,
  },
});
