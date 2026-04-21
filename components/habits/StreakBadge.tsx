import { useTheme } from '@/context/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';

type StreakBadgeProps = {
  streak: number;
};

export default function StreakBadge({ streak }: StreakBadgeProps) {
  const { colours: COLOURS } = useTheme();

  const getColour = () => {
    if (streak >= 14) return COLOURS.danger;
    if (streak >= 7) return COLOURS.warning;
    if (streak >= 3) return COLOURS.primary;
    return COLOURS.textSecondary;
  };

  return (
    <View style={[styles.badge, { backgroundColor: getColour() + '20', borderColor: getColour() }]}>
      <Text style={[styles.fire, { color: getColour() }]}>
        {streak >= 7 ? 'STREAK' : 'streak'}
      </Text>
      <Text style={[styles.count, { color: getColour() }]}>{streak} days</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  fire: { fontSize: 10, fontWeight: '800' },
  count: { fontSize: 11, fontWeight: '700' },
});