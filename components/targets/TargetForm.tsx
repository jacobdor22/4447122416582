import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
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
  const { colours: COLOURS } = useTheme();
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
      <Text style={[styles.label, { color: COLOURS.textPrimary }]}>Period</Text>
      <View style={styles.toggleRow}>
        {['weekly', 'monthly'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.toggleBtn,
              { borderColor: COLOURS.border },
              period === p && { backgroundColor: COLOURS.primary, borderColor: COLOURS.primary },
            ]}
            onPress={() => setPeriod(p)}
            accessibilityLabel={`Set period to ${p}`}
          >
            <Text style={[styles.toggleText, { color: COLOURS.textPrimary }, period === p && styles.toggleTextActive]}>
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
      <Text style={[styles.label, { color: COLOURS.textPrimary }]}>Apply to habit (optional)</Text>
      <View style={styles.habitRow}>
        <TouchableOpacity
          style={[
            styles.habitBtn,
            { borderColor: COLOURS.border },
            habitId === null && { backgroundColor: COLOURS.primary, borderColor: COLOURS.primary },
          ]}
          onPress={() => setHabitId(null)}
          accessibilityLabel="Apply to all habits"
        >
          <Text style={[styles.habitText, { color: COLOURS.textPrimary }, habitId === null && styles.habitTextActive]}>
            Global
          </Text>
        </TouchableOpacity>
        {habits.map((h) => (
          <TouchableOpacity
            key={h.id}
            style={[
              styles.habitBtn,
              { borderColor: COLOURS.border },
              habitId === h.id && { backgroundColor: COLOURS.primary, borderColor: COLOURS.primary },
            ]}
            onPress={() => setHabitId(h.id)}
            accessibilityLabel={`Apply to ${h.name}`}
          >
            <Text style={[styles.habitText, { color: COLOURS.textPrimary }, habitId === h.id && styles.habitTextActive]}>
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
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleText: { fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  habitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  habitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  habitText: { fontSize: 13, fontWeight: '600' },
  habitTextActive: { color: '#fff' },
});