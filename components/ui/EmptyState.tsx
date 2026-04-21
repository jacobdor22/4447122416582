import { useTheme } from '@/context/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  message: string;
};

export default function EmptyState({ title, message }: EmptyStateProps) {
  const { colours: COLOURS } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: COLOURS.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: COLOURS.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  message: { fontSize: 14, textAlign: 'center' },
});