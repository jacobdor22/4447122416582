import { COLOURS } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TargetCardProps = {
  period: string;
  targetValue: number;
  currentValue: number;
  habitName?: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function TargetCard({
  period,
  targetValue,
  currentValue,
  habitName,
  onEdit,
  onDelete,
}: TargetCardProps) {
  const progress = Math.min(currentValue / targetValue, 1);
  const exceeded = currentValue > targetValue;
  const met = currentValue >= targetValue;
  const remaining = Math.max(targetValue - currentValue, 0);

  const getStatusColour = () => {
    if (exceeded || met) return COLOURS.success;
    if (progress >= 0.5) return COLOURS.warning;
    return COLOURS.danger;
  };

  const getStatusText = () => {
    if (exceeded) return 'Target exceeded!';
    if (met) return 'Target met!';
    return `${remaining} remaining`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{habitName ? habitName : 'Global target'}</Text>
          <Text style={styles.subtitle}>
            {period.charAt(0).toUpperCase() + period.slice(1)} · Target: {targetValue}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.editBtn} accessibilityLabel="Edit target">
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} accessibilityLabel="Delete target">
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%` as any, backgroundColor: getStatusColour() },
          ]}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.current}>{currentValue} / {targetValue}</Text>
        <Text style={[styles.status, { color: getStatusColour() }]}>
          {getStatusText()}
        </Text>
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: '600', color: COLOURS.textPrimary },
  subtitle: { fontSize: 12, color: COLOURS.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  editBtn: { padding: 6 },
  editText: { color: COLOURS.primary, fontWeight: '600' },
  deleteBtn: { padding: 6 },
  deleteText: { color: COLOURS.danger, fontWeight: '600' },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  current: { fontSize: 13, color: COLOURS.textSecondary },
  status: { fontSize: 13, fontWeight: '600' },
});