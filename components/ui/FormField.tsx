import { COLOURS } from '@/constants/theme';
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
  return (
    <View style={styles.container}>
      <Text style={styles.label} accessibilityLabel={label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
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
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: COLOURS.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: COLOURS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLOURS.card,
  },
});