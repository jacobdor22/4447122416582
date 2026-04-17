import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { COLOURS } from '@/constants/theme';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Habit = {
  id: number;
  name: string;
};

type TargetFormProps = {
  habits: Habit[];
  initialPeriod?: string;
  initialTargetValue?: string;
  initialHabitId?: number | null;
  onSubmit: (data: { period: string; targetValue: number; habitId: number | null }) => void;
  submitLabel?: string;
};

export default function TargetForm({
  habits,
  initialPeriod = 'weekly',
  initialTargetValue = '',
  initialHabitId = null,
  onSubmit,
  submitLabel = 'Save',
}: TargetFormProps) {
  const [period, setPeriod] = useState(initialPeriod);
  const [targetValue, setTargetValue] = useState(initialTargetValue);
  const [habitId, setHabitId] = useState<number | null>(initialHabitId);

  const handleSubmit = () => {
    if (!targetValue || isNaN(Number(targetValue))) {
      Alert.alert('Error', 'Please enter a valid target number');
      return;
    }
    onSubmit({ period, targetValue: Number(targetValue), habitId });
  };

  return (
    <View>
      <Text style={styles.label}>Period</Text>
      <View style={styles.toggleRow}>
        {['weekly', 'monthly'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.toggleBtn, period === p && styles.toggleActive]}
            onPress={() => setPeriod(p)}
            accessibilityLabel={`Set period to ${p}`}
          >
            <Text style={[styles.toggleText, period === p && styles.toggleTextActive]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FormField
        label="Target value"
        placeholder="e.g. 5"
        value={targetValue}
        onChangeText={setTargetValue}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Apply to habit (optional)</Text>
      <View style={styles.habitRow}>
        <TouchableOpacity
          style={[styles.habitBtn, habitId === null && styles.habitBtnActive]}
          onPress={() => setHabitId(null)}
          accessibilityLabel="Apply to all habits"
        >
          <Text style={[styles.habitText, habitId === null && styles.habitTextActive]}>
            Global
          </Text>
        </TouchableOpacity>
        {habits.map((h) => (
          <TouchableOpacity
            key={h.id}
            style={[styles.habitBtn, habitId === h.id && styles.habitBtnActive]}
            onPress={() => setHabitId(h.id)}
            accessibilityLabel={`Apply to ${h.name}`}
          >
            <Text style={[styles.habitText, habitId === h.id && styles.habitTextActive]}>
              {h.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <PrimaryButton title={submitLabel} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: COLOURS.textPrimary },
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOURS.border,
  },
  toggleActive: { backgroundColor: COLOURS.primary, borderColor: COLOURS.primary },
  toggleText: { color: COLOURS.textPrimary, fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  habitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  habitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLOURS.border,
  },
  habitBtnActive: { backgroundColor: COLOURS.primary, borderColor: COLOURS.primary },
  habitText: { fontSize: 13, fontWeight: '600', color: COLOURS.textPrimary },
  habitTextActive: { color: '#fff' },
});