import { COLOURS } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HabitCardProps = {
  name: string;
  category: string;
  categoryColour: string;
  metricType: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function HabitCard({
  name,
  category,
  categoryColour,
  metricType,
  onEdit,
  onDelete,
}: HabitCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={[styles.dot, { backgroundColor: categoryColour }]} />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.category}>
            {category} · {metricType === 'boolean' ? 'Yes/No' : 'Count'}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.editBtn} accessibilityLabel={`Edit ${name}`}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} accessibilityLabel={`Delete ${name}`}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLOURS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600', color: COLOURS.textPrimary },
  category: { fontSize: 12, color: COLOURS.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  editBtn: { padding: 6 },
  editText: { color: COLOURS.primary, fontWeight: '600' },
  deleteBtn: { padding: 6 },
  deleteText: { color: COLOURS.danger, fontWeight: '600' },
});