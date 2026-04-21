import { useTheme } from '@/context/ThemeContext';
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
  const { colours: COLOURS } = useTheme();
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
    <View style={[styles.card, { backgroundColor: COLOURS.card }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: COLOURS.textPrimary }]}>{habitName ? habitName : 'Global target'}</Text>
          <Text style={[styles.subtitle, { color: COLOURS.textSecondary }]}>
            {period.charAt(0).toUpperCase() + period.slice(1)} · Target: {targetValue}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.editBtn} accessibilityLabel="Edit target">
            <Text style={[styles.editText, { color: COLOURS.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} accessibilityLabel="Delete target">
            <Text style={[styles.deleteText, { color: COLOURS.danger }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.progressBar, { backgroundColor: COLOURS.border }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%` as any, backgroundColor: getStatusColour() },
          ]}
        />
      </View>
      <View style={styles.footer}>
        <Text style={[styles.current, { color: COLOURS.textSecondary }]}>{currentValue} / {targetValue}</Text>
        <Text style={[styles.status, { color: getStatusColour() }]}>
          {getStatusText()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  editBtn: { padding: 6 },
  editText: { fontWeight: '600' },
  deleteBtn: { padding: 6 },
  deleteText: { fontWeight: '600' },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  current: { fontSize: 13 },
  status: { fontSize: 13, fontWeight: '600' },
});