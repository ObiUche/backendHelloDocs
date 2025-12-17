// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import SplashScreen from '../components/onboarding/SplashScreen';
import { Colors } from '../constants/Colors';
import { AuthProvider, useAuth } from '../context/AuthContext';

// This component handles the routing logic
function RootLayoutNav() {
  const { user, loading } = useAuth();
  const [splashVisible, setSplashVisible] = useState(true);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setSplashVisible(false);
  };

  // Show splash screen until auth check is done
  if (splashVisible || loading) {
    return <SplashScreen onLoadingComplete={handleSplashComplete} />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: '#fff',
        headerShown: false,
      }}
    >
      {/* DON'T define any Stack.Screen components here */}
      {/* Let Expo Router automatically discover your files in (app) and (public) folders */}
    </Stack>
  );
}

// Main App wrapper with providers
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Add any async initialization here
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsReady(true);
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});