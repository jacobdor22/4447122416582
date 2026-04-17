import { COLOURS } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CategoryCardProps = {
  name: string;
  colour: string;
  icon: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CategoryCard({
  name,
  colour,
  icon,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={[styles.iconBox, { backgroundColor: colour + '20' }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={[styles.dot, { backgroundColor: colour }]} />
        <Text style={styles.name}>{name}</Text>
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
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 18 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { fontSize: 16, fontWeight: '600', color: COLOURS.textPrimary },
  actions: { flexDirection: 'row', gap: 8 },
  editBtn: { padding: 6 },
  editText: { color: COLOURS.primary, fontWeight: '600' },
  deleteBtn: { padding: 6 },
  deleteText: { color: COLOURS.danger, fontWeight: '600' },
});