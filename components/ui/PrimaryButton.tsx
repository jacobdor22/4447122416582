import { useTheme } from '@/context/ThemeContext';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
}: PrimaryButtonProps) {
  const { colours: COLOURS } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: COLOURS.primary }, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});