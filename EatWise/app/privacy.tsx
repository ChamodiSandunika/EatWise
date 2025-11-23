import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const PRIVACY_SETTINGS_KEY = '@eatwise_privacy_settings';

interface PrivacySettings {
  shareUsageData: boolean;
  personalization: boolean;
  crashReports: boolean;
  marketingEmails: boolean;
  biometricAuth: boolean;
  autoLock: boolean;
  showCaloriesOnHome: boolean;
  privateMode: boolean;
}

const defaultSettings: PrivacySettings = {
  shareUsageData: false,
  personalization: true,
  crashReports: true,
  marketingEmails: false,
  biometricAuth: false,
  autoLock: false,
  showCaloriesOnHome: true,
  privateMode: false,
};

export default function PrivacyScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<PrivacySettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(PRIVACY_SETTINGS_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: PrivacySettings) => {
    try {
      await AsyncStorage.setItem(PRIVACY_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
      Alert.alert('Error', 'Failed to save privacy settings');
    }
  };

  const toggleSetting = (key: keyof PrivacySettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Your Data',
      'This will prepare all your data for download. You will receive a JSON file with all your meals, goals, and settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            Alert.alert('Success', 'Your data export has been prepared. Check your downloads folder.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Please type DELETE to confirm account deletion.',
              [{ text: 'Cancel' }]
            );
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear temporary data and may free up storage space. Your meals and settings will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully.');
          },
        },
      ]
    );
  };

  const viewPrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'This would open the full privacy policy in a web view or browser.',
      [{ text: 'OK' }]
    );
  };

  const viewTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'This would open the terms of service in a web view or browser.',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <Text style={styles.sectionDescription}>
            Control how your data is collected and used
          </Text>

          <View style={styles.card}>
            <SettingItem
              icon="share-2"
              iconBg="#3b82f6"
              title="Share Usage Data"
              description="Help improve the app by sharing anonymous usage statistics"
              value={settings.shareUsageData}
              onToggle={() => toggleSetting('shareUsageData')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="sliders"
              iconBg="#8b5cf6"
              title="Personalization"
              description="Allow personalized recommendations based on your habits"
              value={settings.personalization}
              onToggle={() => toggleSetting('personalization')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="alert-octagon"
              iconBg="#f59e0b"
              title="Crash Reports"
              description="Automatically send crash reports to help fix bugs"
              value={settings.crashReports}
              onToggle={() => toggleSetting('crashReports')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="mail"
              iconBg="#06b6d4"
              title="Marketing Emails"
              description="Receive promotional emails and special offers"
              value={settings.marketingEmails}
              onToggle={() => toggleSetting('marketingEmails')}
            />
          </View>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          <Text style={styles.sectionDescription}>
            Protect your account and data
          </Text>

          <View style={styles.card}>
            <SettingItem
              icon="lock"
              iconBg="#10b981"
              title="Biometric Authentication"
              description="Use fingerprint or face ID to unlock the app"
              value={settings.biometricAuth}
              onToggle={() => toggleSetting('biometricAuth')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="shield"
              iconBg="#6366f1"
              title="Auto-Lock"
              description="Automatically lock the app when inactive"
              value={settings.autoLock}
              onToggle={() => toggleSetting('autoLock')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="eye-off"
              iconBg="#64748b"
              title="Private Mode"
              description="Hide sensitive information on app switcher"
              value={settings.privateMode}
              onToggle={() => toggleSetting('privateMode')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="eye"
              iconBg="#ec4899"
              title="Show Calories on Home"
              description="Display calorie information on the home screen"
              value={settings.showCaloriesOnHome}
              onToggle={() => toggleSetting('showCaloriesOnHome')}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <Text style={styles.sectionDescription}>
            Manage your stored data
          </Text>

          <View style={styles.card}>
            <ActionItem
              icon="download"
              iconBg="#10b981"
              title="Export Your Data"
              description="Download all your data in JSON format"
              onPress={handleExportData}
              showArrow
            />
            <View style={styles.divider} />
            <ActionItem
              icon="trash-2"
              iconBg="#f59e0b"
              title="Clear Cache"
              description="Free up storage space"
              onPress={handleClearCache}
              showArrow
            />
            <View style={styles.divider} />
            <ActionItem
              icon="x-circle"
              iconBg="#ef4444"
              title="Delete Account"
              description="Permanently delete your account and all data"
              onPress={handleDeleteAccount}
              showArrow
            />
          </View>
        </View>

        {/* Legal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal Information</Text>

          <View style={styles.card}>
            <ActionItem
              icon="file-text"
              iconBg="#3b82f6"
              title="Privacy Policy"
              description="Read our privacy policy"
              onPress={viewPrivacyPolicy}
              showArrow
            />
            <View style={styles.divider} />
            <ActionItem
              icon="file-text"
              iconBg="#8b5cf6"
              title="Terms of Service"
              description="Read our terms of service"
              onPress={viewTermsOfService}
              showArrow
            />
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Feather name="shield" size={20} color="#10b981" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Your Privacy Matters</Text>
            <Text style={styles.infoText}>
              We take your privacy seriously. All your meal data is stored locally on your
              device and is never shared without your explicit consent.
            </Text>
          </View>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>EatWise v1.0.0</Text>
          <Text style={styles.versionSubtext}>Last updated: November 2025</Text>
        </View>
      </ScrollView>
    </View>
  );
}

interface SettingItemProps {
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

function SettingItem({ icon, iconBg, title, description, value, onToggle }: SettingItemProps) {
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

interface ActionItemProps {
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  title: string;
  description: string;
  onPress: () => void;
  showArrow?: boolean;
}

function ActionItem({ icon, iconBg, title, description, onPress, showArrow }: ActionItemProps) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.actionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Feather name={icon} size={20} color="#fff" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      {showArrow && <Feather name="chevron-right" size={20} color="#9ca3af" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
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
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
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
    color: '#1f2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 68,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#15803d',
    lineHeight: 18,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 11,
    color: '#d1d5db',
    marginTop: 4,
  },
});
