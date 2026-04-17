import { COLOURS } from '@/constants/theme';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type FactCardProps = {
  title: string;
  fact: string;
  loading: boolean;
};

export default function FactCard({ title, fact, loading }: FactCardProps) {
  return (
    <View style={styles.card}>
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
    backgroundColor: COLOURS.primary,
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