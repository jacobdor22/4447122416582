import { useTheme } from '@/context/ThemeContext';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type FormFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
};

export default function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
}: FormFieldProps) {
  const { colours: COLOURS } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: COLOURS.textPrimary }]} accessibilityLabel={label}>{label}</Text>
      <TextInput
        style={[styles.input, { borderColor: COLOURS.border, backgroundColor: COLOURS.card, color: COLOURS.textPrimary }]}
        placeholder={placeholder}
        placeholderTextColor={COLOURS.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});