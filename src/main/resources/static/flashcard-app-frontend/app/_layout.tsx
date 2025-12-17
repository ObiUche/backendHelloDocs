import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: '#fff',
          }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="flashcard/[id]"
            options={{ title: 'Flashcard Details' }}
          />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}