import { useTheme } from '@/context/ThemeContext';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type FactCardProps = {
  title: string;
  fact: string;
  loading: boolean;
};

export default function FactCard({ title, fact, loading }: FactCardProps) {
  const { colours: COLOURS } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: COLOURS.primary }]}>
      <Text style={styles.title}>{title}</Text>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.fact}>{fact}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 12, fontWeight: '700', color: '#ffffff99', marginBottom: 6 },
  fact: { fontSize: 14, color: '#fff', lineHeight: 20 },
});