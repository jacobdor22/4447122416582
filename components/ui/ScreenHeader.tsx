import { useTheme } from '@/context/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  const { colours: COLOURS } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: COLOURS.textPrimary }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: COLOURS.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
});