import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { COLOURS } from '@/constants/theme';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLOUR_OPTIONS = [
  '#16A34A', '#43C59E', '#FF6584', '#FFB347',
  '#4FC3F7', '#FF7043', '#AB47BC', '#3B5BDB',
];

const ICON_OPTIONS = [
  'Run', 'Read', 'Health', 'Mind', 'Strength',
  'Water', 'Goal', 'Art', 'Music', 'Sleep', 'Focus', 'Love',
];

type CategoryFormProps = {
  initialName?: string;
  initialColour?: string;
  initialIcon?: string;
  onSubmit: (data: { name: string; colour: string; icon: string }) => void;
  submitLabel?: string;
};

export default function CategoryForm({
  initialName = '',
  initialColour = '#16A34A',
  initialIcon = 'Goal',
  onSubmit,
  submitLabel = 'Save',
}: CategoryFormProps) {
  const [name, setName] = useState(initialName);
  const [colour, setColour] = useState(initialColour);
  const [icon, setIcon] = useState(initialIcon);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    onSubmit({ name, colour, icon });
  };

  return (
    <View>
      <FormField
        label="Category name"
        placeholder="e.g. Fitness"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Colour</Text>
      <View style={styles.colourRow}>
        {COLOUR_OPTIONS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.colourDot, { backgroundColor: c }, colour === c && styles.colourSelected]}
            onPress={() => setColour(c)}
            accessibilityLabel={`Select colour ${c}`}
          />
        ))}
      </View>
      <Text style={styles.label}>Icon</Text>
      <View style={styles.iconRow}>
        {ICON_OPTIONS.map((i) => (
          <TouchableOpacity
            key={i}
            style={[styles.iconBtn, { borderColor: colour }, icon === i && { backgroundColor: colour }]}
            onPress={() => setIcon(i)}
            accessibilityLabel={`Select icon ${i}`}
          >
            <Text style={[styles.iconText, icon === i && { color: '#fff' }]}>{i}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <PrimaryButton title={submitLabel} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: COLOURS.textPrimary },
  colourRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  colourDot: { width: 32, height: 32, borderRadius: 16 },
  colourSelected: { borderWidth: 3, borderColor: COLOURS.textPrimary },
  iconRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  iconBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 12, fontWeight: '600', color: COLOURS.textPrimary },
});