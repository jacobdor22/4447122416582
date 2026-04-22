import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { seedIfEmpty } from '@/db/seed';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  // run seed on startup — only inserts if database is empty
  useEffect(() => {
    seedIfEmpty();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}