/**
 * Index/Entry Screen
 * Initial entry point that checks Clerk auth and redirects
 */

import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      console.log('🧭 Index: Auth loaded - isSignedIn:', isSignedIn);
    }
  }, [isLoaded, isSignedIn]);

  // Show splash screen while Clerk is loading
  if (!isLoaded) {
    return <SplashScreen />;
  }

  // Redirect based on auth status
  if (isSignedIn) {
    console.log('➡️ Index: Going to main app');
    return <Redirect href="/(tabs)" />;
  } else {
    console.log('➡️ Index: Going to sign in');
    return <Redirect href="/sign-in" />;
  }
}
