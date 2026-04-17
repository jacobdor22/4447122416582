import PrimaryButton from '@/components/ui/PrimaryButton';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { COLOURS } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { db } from '@/db/client';
import { categories, habitLogs, habits, targets, users } from '@/db/schema';
import { exportHabitsCSV } from '@/utils/exportCSV';
import { cancelAllReminders, requestNotificationPermissions, scheduleDailyReminder } from '@/utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('notifications').then(val => {
      setNotificationsEnabled(val === 'true');
    });
  }, []);

  if (!user) return null;

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert('Permission required', 'Please enable notifications in your device settings.');
        return;
      }
      await scheduleDailyReminder();
      await AsyncStorage.setItem('notifications', 'true');
      setNotificationsEnabled(true);
      Alert.alert('Reminders on', 'You will be reminded at 8pm every day.');
    } else {
      await cancelAllReminders();
      await AsyncStorage.setItem('notifications', 'false');
      setNotificationsEnabled(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out', style: 'destructive', onPress: () => {
          logout();
          router.replace('/(auth)/login');
        }
      },
    ]);
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      'Delete Profile',
      'This will permanently delete your account and all your data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            if (!user) return;
            await db.delete(habitLogs).where(eq(habitLogs.habitId, user.id));
            await db.delete(targets).where(eq(targets.userId, user.id));
            await db.delete(habits).where(eq(habits.userId, user.id));
            await db.delete(categories).where(eq(categories.userId, user.id));
            await db.delete(users).where(eq(users.id, user.id));
            logout();
            router.replace('/(auth)/register');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Settings" />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Logged in as</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Theme</Text>
          <Text style={styles.value}>{theme === 'light' ? 'Light mode' : 'Dark mode'}</Text>
        </View>
        <PrimaryButton
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          onPress={toggleTheme}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Daily reminder at 8pm</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: COLOURS.border, true: COLOURS.primary }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <PrimaryButton
          title="Export Habits to CSV"
          onPress={() => user && exportHabitsCSV(user.id)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danger zone</Text>
        <PrimaryButton title="Log out" onPress={handleLogout} />
        <View style={styles.gap} />
        <PrimaryButton title="Delete Profile" onPress={handleDeleteProfile} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: COLOURS.background },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLOURS.textSecondary, marginBottom: 8 },
  card: {
    backgroundColor: COLOURS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 12, color: COLOURS.textSecondary, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '600', color: COLOURS.textPrimary },
  gap: { height: 8 },
});