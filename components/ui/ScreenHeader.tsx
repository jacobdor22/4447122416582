import { COLOURS } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLOURS.textPrimary },
  subtitle: { fontSize: 14, color: COLOURS.textSecondary, marginTop: 4 },
});