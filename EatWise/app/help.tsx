import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FAQItem {
  question: string;
  answer: string;
  icon: keyof typeof Feather.glyphMap;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I add a meal?',
    answer:
      'Tap the + button on the home screen or go to the Meals tab. Enter your meal description in natural language (e.g., "2 eggs and toast") and our nutrition API will analyze it for you.',
    icon: 'plus-circle',
  },
  {
    question: 'How accurate is the calorie tracking?',
    answer:
      'We use the API Ninjas Nutrition API which provides accurate nutritional data for thousands of foods. However, estimates may vary based on preparation methods and portion sizes. For best results, be as specific as possible when entering meals.',
    icon: 'activity',
  },
  {
    question: 'How do I set my daily calorie goal?',
    answer:
      'Go to your Profile tab and tap the edit button next to your daily goal. Enter your desired calorie target (500-10,000 cal). Your goal is saved automatically and synced across the app.',
    icon: 'target',
  },
  {
    question: 'Can I edit or delete past meals?',
    answer:
      'Yes! Go to Meal History from your profile settings. Tap on any meal to view details, edit information, or delete it. Changes are saved instantly.',
    icon: 'edit-3',
  },
  {
    question: 'How do I change my profile picture?',
    answer:
      'Go to your Profile tab and tap on your avatar. You can choose a photo from your gallery or take a new one. The app will ask for camera/photo permissions if needed.',
    icon: 'camera',
  },
  {
    question: 'Why am I not receiving notifications?',
    answer:
      'Make sure notifications are enabled in both the app settings (Notifications page) and your device system settings. Go to your phone Settings > Apps > EatWise > Notifications and enable them.',
    icon: 'bell',
  },
  {
    question: 'Is my data stored securely?',
    answer:
      'Yes! All your meal data is stored locally on your device using encrypted AsyncStorage. Your data is never uploaded to external servers without your explicit consent. You can manage your privacy settings in Privacy & Security.',
    icon: 'shield',
  },
  {
    question: 'How do I export my data?',
    answer:
      'Go to Privacy & Security > Data Management > Export Your Data. Your meal history, goals, and settings will be downloaded as a JSON file that you can save or share.',
    icon: 'download',
  },
  {
    question: 'What should I do if the app crashes?',
    answer:
      'Try restarting the app first. If the problem persists, clear the app cache in Privacy & Security settings. If issues continue, contact support with details about what you were doing when it crashed.',
    icon: 'alert-triangle',
  },
  {
    question: 'Can I use the app offline?',
    answer:
      'You can view your meal history and profile offline, but adding new meals requires an internet connection to analyze nutrition data via our API.',
    icon: 'wifi-off',
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose your preferred method to contact us:',
      [
        {
          text: 'Email',
          onPress: () => {
            Linking.openURL('mailto:support@eatwise.app?subject=Support Request');
          },
        },
        {
          text: 'Chat',
          onPress: () => {
            Alert.alert('Chat Support', 'Live chat support would open here.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Empty Feedback', 'Please enter your feedback before submitting.');
      return;
    }

    Alert.alert(
      'Feedback Submitted',
      'Thank you for your feedback! We appreciate your input and will review it carefully.',
      [
        {
          text: 'OK',
          onPress: () => setFeedbackText(''),
        },
      ]
    );
  };

  const openUserGuide = () => {
    Alert.alert('User Guide', 'This would open a comprehensive user guide or tutorial.');
  };

  const openVideoTutorials = () => {
    Alert.alert('Video Tutorials', 'This would open a library of video tutorials.');
  };

  const reportBug = () => {
    Alert.alert(
      'Report a Bug',
      'Please describe the issue you encountered:',
      [{ text: 'Cancel' }]
    );
  };

  const suggestFeature = () => {
    Alert.alert(
      'Suggest a Feature',
      'We\'d love to hear your ideas! What feature would you like to see?',
      [{ text: 'Cancel' }]
    );
  };

  const openCommunity = () => {
    Alert.alert(
      'Community Forum',
      'Join our community to connect with other users, share tips, and get advice!',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickActions}>
            <QuickActionCard
              icon="message-circle"
              iconBg="#10b981"
              title="Contact Support"
              onPress={handleContactSupport}
            />
            <QuickActionCard
              icon="book-open"
              iconBg="#3b82f6"
              title="User Guide"
              onPress={openUserGuide}
            />
            <QuickActionCard
              icon="video"
              iconBg="#8b5cf6"
              title="Tutorials"
              onPress={openVideoTutorials}
            />
            <QuickActionCard
              icon="users"
              iconBg="#f59e0b"
              title="Community"
              onPress={openCommunity}
            />
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <Text style={styles.sectionDescription}>
            Find answers to common questions
          </Text>

          <View style={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <FAQItemComponent
                key={index}
                faq={faq}
                isExpanded={expandedIndex === index}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </View>
        </View>

        {/* Feedback Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Us Feedback</Text>
          <Text style={styles.sectionDescription}>
            Help us improve EatWise with your suggestions
          </Text>

          <View style={styles.feedbackCard}>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Share your thoughts, suggestions, or report issues..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={6}
              value={feedbackText}
              onChangeText={setFeedbackText}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
              <Feather name="send" size={18} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Help</Text>

          <View style={styles.card}>
            <HelpMenuItem
              icon="alert-circle"
              iconBg="#ef4444"
              title="Report a Bug"
              description="Let us know about any issues you encounter"
              onPress={reportBug}
            />
            <View style={styles.divider} />
            <HelpMenuItem
              icon="zap"
              iconBg="#f59e0b"
              title="Suggest a Feature"
              description="Share your ideas for new features"
              onPress={suggestFeature}
            />
            <View style={styles.divider} />
            <HelpMenuItem
              icon="star"
              iconBg="#fbbf24"
              title="Rate the App"
              description="Enjoying EatWise? Leave us a review!"
              onPress={() => Alert.alert('Rate App', 'This would open the app store rating page.')}
            />
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactBox}>
          <Feather name="mail" size={24} color="#10b981" />
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Need More Help?</Text>
            <Text style={styles.contactText}>
              Our support team is available 24/7
            </Text>
            <Text style={styles.contactEmail}>support@eatwise.app</Text>
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#3b82f6' }]}>
              <Feather name="facebook" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1da1f2' }]}>
              <Feather name="twitter" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#e4405f' }]}>
              <Feather name="instagram" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#0077b5' }]}>
              <Feather name="linkedin" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

interface QuickActionCardProps {
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  title: string;
  onPress: () => void;
}

function QuickActionCard({ icon, iconBg, title, onPress }: QuickActionCardProps) {
  return (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={24} color="#fff" />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );
}

interface FAQItemComponentProps {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

function FAQItemComponent({ faq, isExpanded, onToggle }: FAQItemComponentProps) {
  return (
    <TouchableOpacity style={styles.faqItem} onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.faqHeader}>
        <View style={styles.faqIconContainer}>
          <Feather name={faq.icon} size={18} color="#10b981" />
        </View>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Feather
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6b7280"
        />
      </View>
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{faq.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

interface HelpMenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  title: string;
  description: string;
  onPress: () => void;
}

function HelpMenuItem({ icon, iconBg, title, description, onPress }: HelpMenuItemProps) {
  return (
    <TouchableOpacity style={styles.helpMenuItem} onPress={onPress}>
      <View style={styles.helpMenuLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Feather name={icon} size={20} color="#fff" />
        </View>
        <View style={styles.helpMenuInfo}>
          <Text style={styles.helpMenuTitle}>{title}</Text>
          <Text style={styles.helpMenuDescription}>{description}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="#9ca3af" />
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
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  faqContainer: {
    gap: 8,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  faqIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  faqAnswer: {
    marginTop: 12,
    marginLeft: 44,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  feedbackCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  feedbackInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1f2937',
    minHeight: 120,
    marginBottom: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
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
  helpMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  helpMenuLeft: {
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
  helpMenuInfo: {
    flex: 1,
  },
  helpMenuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  helpMenuDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 68,
  },
  contactBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    gap: 16,
    borderWidth: 2,
    borderColor: '#d1fae5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  contactEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  socialContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
