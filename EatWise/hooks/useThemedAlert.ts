/**
 * useThemedAlert Hook
 * Custom hook for showing themed alerts that respect dark mode
 */

import { useCallback, useState } from 'react';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertConfig {
  title: string;
  message: string;
  buttons?: AlertButton[];
}

export const useThemedAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = useCallback(
    (title: string, message: string, buttons?: AlertButton[]) => {
      setAlertConfig({
        title,
        message,
        buttons: buttons || [{ text: 'OK', style: 'default' }],
      });
      setIsVisible(true);
    },
    []
  );

  const hideAlert = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setAlertConfig(null), 300);
  }, []);

  return {
    alertConfig,
    isVisible,
    showAlert,
    hideAlert,
  };
};
