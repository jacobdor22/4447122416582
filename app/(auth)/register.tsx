import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { db } from '@/db/client';
import { categories, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { colours: COLOURS } = useTheme();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        Alert.alert('Error', 'An account with that email already exists');
        return;
      }
      await db.insert(users).values({
        email,
        passwordHash: password,
        createdAt: new Date().toISOString(),
      });
      const result = await db.select().from(users).where(eq(users.email, email));
      const newUser = result[0];

      await db.insert(categories).values([
        { userId: newUser.id, name: 'Fitness', colour: '#16A34A', icon: 'Run' },
        { userId: newUser.id, name: 'Learning', colour: '#43C59E', icon: 'Read' },
        { userId: newUser.id, name: 'Health', colour: '#FF6584', icon: 'Health' },
        { userId: newUser.id, name: 'Mindfulness', colour: '#FFB347', icon: 'Mind' },
      ]);

      login({ id: newUser.id, email: newUser.email });
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
      <Text style={[styles.title, { color: COLOURS.textPrimary }]}>Create account</Text>
      <Text style={[styles.subtitle, { color: COLOURS.textSecondary }]}>Start tracking your habits</Text>
      <FormField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <FormField
        label="Password"
        placeholder="Choose a password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <PrimaryButton title="Register" onPress={handleRegister} />
      <Text style={[styles.link, { color: COLOURS.primary }]} onPress={() => router.push('/(auth)/login')}>
        Already have an account? Log in
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