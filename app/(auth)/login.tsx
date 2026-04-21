import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { colours: COLOURS } = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const result = await db.select().from(users).where(eq(users.email, email));
      if (result.length === 0) {
        Alert.alert('Error', 'No account found with that email');
        return;
      }
      const user = result[0];
      if (user.passwordHash !== password) {
        Alert.alert('Error', 'Incorrect password');
        return;
      }
      login({ id: user.id, email: user.email });
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: COLOURS.background }]}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <Text style={[styles.appName, { color: COLOURS.textPrimary }]}>Habit Tracker</Text>
      </View>
      <Text style={[styles.title, { color: COLOURS.textPrimary }]}>Welcome back</Text>
      <Text style={[styles.subtitle, { color: COLOURS.textSecondary }]}>Log in to your account</Text>
      <FormField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <FormField
        label="Password"
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <PrimaryButton title="Log in" onPress={handleLogin} />
      <Text style={[styles.link, { color: COLOURS.primary }]} onPress={() => router.push('/(auth)/register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 100, height: 100, borderRadius: 20, marginBottom: 12 },
  appName: { fontSize: 18, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 32 },
  link: { marginTop: 16, textAlign: 'center' },
});