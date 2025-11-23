/**
 * Themed Alert Component
 * Custom alert dialog that supports dark mode
 */

import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface ThemedAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  isDarkMode?: boolean;
  onDismiss?: () => void;
}

export const ThemedAlert: React.FC<ThemedAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  isDarkMode = false,
  onDismiss,
}) => {
  const styles = createStyles(isDarkMode);

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={styles.alertContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.alertContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    button.style === 'cancel' && styles.cancelButton,
                    button.style === 'destructive' && styles.destructiveButton,
                    buttons.length === 1 && styles.singleButton,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      button.style === 'cancel' && styles.cancelButtonText,
                      button.style === 'destructive' && styles.destructiveButtonText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    alertContainer: {
      width: '100%',
      maxWidth: 340,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    alertContent: {
      padding: 24,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#f9fafb' : '#1f2937',
      marginBottom: 12,
      textAlign: 'center',
    },
    message: {
      fontSize: 15,
      color: isDark ? '#d1d5db' : '#4b5563',
      lineHeight: 22,
      textAlign: 'center',
      marginBottom: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: '#10b981',
      alignItems: 'center',
      justifyContent: 'center',
    },
    singleButton: {
      flex: 1,
    },
    cancelButton: {
      backgroundColor: isDark ? '#374151' : '#e5e7eb',
    },
    destructiveButton: {
      backgroundColor: '#ef4444',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
    },
    cancelButtonText: {
      color: isDark ? '#d1d5db' : '#4b5563',
    },
    destructiveButtonText: {
      color: '#ffffff',
    },
  });

// Utility function to show themed alert
export const showThemedAlert = (
  title: string,
  message: string,
  buttons: AlertButton[] = [{ text: 'OK', style: 'default' }],
  isDarkMode: boolean = false
): Promise<void> => {
  return new Promise((resolve) => {
    // This is a helper - actual implementation needs a component to render
    // Used by wrapping components that manage state
    resolve();
  });
};
