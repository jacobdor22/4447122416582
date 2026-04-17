import { StyleSheet, Text, View } from 'react-native';

type CategoryBadgeProps = {
  name: string;
  colour: string;
  icon: string;
};

export default function CategoryBadge({ name, colour, icon }: CategoryBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: colour + '20', borderColor: colour }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.name, { color: colour }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  icon: { fontSize: 12 },
  name: { fontSize: 12, fontWeight: '600' },
});