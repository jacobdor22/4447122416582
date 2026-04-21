import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Category = {
  id: number;
  name: string;
  colour: string;
};

type HabitFormProps = {
  initialName?: string;
  initialNotes?: string;
  initialMetricType?: string;
  initialCategoryId?: number;
  categories: Category[];
  onSubmit: (data: {
    name: string;
    notes: string;
    metricType: string;
    categoryId: number;
  }) => void;
  submitLabel?: string;
};

export default function HabitForm({
  initialName = '',
  initialNotes = '',
  initialMetricType = 'boolean',
  initialCategoryId,
  categories,
  onSubmit,
  submitLabel = 'Save',
}: HabitFormProps) {
  const { colours: COLOURS } = useTheme();
  const [name, setName] = useState(initialName);
  const [notes, setNotes] = useState(initialNotes);
  const [metricType, setMetricType] = useState(initialMetricType);
  const [categoryId, setCategoryId] = useState<number>(
    initialCategoryId ?? categories[0]?.id ?? 0
  );

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }
    onSubmit({ name, notes, metricType, categoryId });
  };

  return (
    <View>
      <FormField
        label="Habit name"
        placeholder="e.g. Morning Run"
        value={name}
        onChangeText={setName}
      />
      <FormField
        label="Notes (optional)"
        placeholder="Any extra details"
        value={notes}
        onChangeText={setNotes}
      />
      <Text style={[styles.label, { color: COLOURS.textPrimary }]}>Metric type</Text>
      <View style={styles.row}>
        <View style={styles.toggleRow}>
          {['boolean', 'count'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.toggleBtn,
                { borderColor: COLOURS.border },
                metricType === type && { backgroundColor: COLOURS.primary, borderColor: COLOURS.primary },
              ]}
              onPress={() => setMetricType(type)}
              accessibilityLabel={`Set metric type to ${type === 'boolean' ? 'Yes/No' : 'Count'}`}
            >
              <Text style={[styles.toggleText, { color: COLOURS.textPrimary }, metricType === type && styles.toggleTextActive]}>
                {type === 'boolean' ? 'Yes/No' : 'Count'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Text style={[styles.label, { color: COLOURS.textPrimary }]}>Category</Text>
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryBtn,
              { borderColor: cat.colour },
              categoryId === cat.id && { backgroundColor: cat.colour },
            ]}
            onPress={() => setCategoryId(cat.id)}
            accessibilityLabel={`Select category ${cat.name}`}
          >
            <Text style={[styles.categoryText, { color: COLOURS.textPrimary }, categoryId === cat.id && { color: '#fff' }]}>
              {cat.name}
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
  row: { marginBottom: 16 },
  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleText: { fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: { fontSize: 13, fontWeight: '600' },
});