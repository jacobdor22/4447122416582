import EmptyState from '@/components/ui/EmptyState';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { COLOURS } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/db/client';
import { categories, habitLogs, habits } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Habit = {
  id: number;
  name: string;
  metricType: string;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
  colour: string;
};

type LogEntry = {
  habitId: number;
  completed: number | null;
  count: number | null;
};

export default function LogScreen() {
  const { user } = useAuth();
  const [habitList, setHabitList] = useState<Habit[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;
    const habs = await db.select().from(habits).where(eq(habits.userId, user.id));
    const cats = await db.select().from(categories).where(eq(categories.userId, user.id));
    const todayLogs = await db.select().from(habitLogs).where(eq(habitLogs.date, today));
    setHabitList(habs);
    setCategoryList(cats);
    setLogs(todayLogs.map(l => ({ habitId: l.habitId, completed: l.completed, count: l.count })));
  };

  const getLog = (habitId: number) => logs.find(l => l.habitId === habitId);

  const toggleBoolean = async (habit: Habit) => {
    const existing = getLog(habit.id);
    if (existing) {
      await db.delete(habitLogs).where(
        and(eq(habitLogs.habitId, habit.id), eq(habitLogs.date, today))
      );
      setLogs(logs.filter(l => l.habitId !== habit.id));
    } else {
      await db.insert(habitLogs).values({
        habitId: habit.id,
        date: today,
        completed: 1,
        count: null,
        notes: null,
      });
      setLogs([...logs, { habitId: habit.id, completed: 1, count: null }]);
    }
  };

  const updateCount = async (habit: Habit, delta: number) => {
    const existing = getLog(habit.id);
    const newCount = Math.max(0, (existing?.count ?? 0) + delta);
    if (existing) {
      await db.update(habitLogs).set({ count: newCount }).where(
        and(eq(habitLogs.habitId, habit.id), eq(habitLogs.date, today))
      );
    } else {
      await db.insert(habitLogs).values({
        habitId: habit.id,
        date: today,
        completed: null,
        count: newCount,
        notes: null,
      });
    }
    setLogs(logs.map(l => l.habitId === habit.id ? { ...l, count: newCount } :
      l).concat(existing ? [] : [{ habitId: habit.id, completed: null, count: newCount }]));
  };

  const getCategoryById = (id: number) =>
    categoryList.find(c => c.id === id) ?? { name: 'Unknown', colour: '#ccc' };

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Today's Log" subtitle={today} />
      {habitList.length === 0 ? (
        <EmptyState title="No habits yet" message="Add habits first from the Habits tab" />
      ) : (
        <FlatList
          data={habitList}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const cat = getCategoryById(item.categoryId);
            const log = getLog(item.id);
            return (
              <View style={styles.card}>
                <View style={styles.left}>
                  <View style={[styles.dot, { backgroundColor: cat.colour }]} />
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.category}>{cat.name}</Text>
                  </View>
                </View>
                {item.metricType === 'boolean' ? (
                  <TouchableOpacity
                    style={[styles.checkBtn, log && styles.checkBtnDone]}
                    onPress={() => toggleBoolean(item)}
                    accessibilityLabel={log ? `Mark ${item.name} as not done` : `Mark ${item.name} as done`}
                  >
                    <Text style={[styles.checkText, log && styles.checkTextDone]}>
                      {log ? '✓ Done' : 'Mark Done'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.countRow}>
                    <TouchableOpacity
                      style={styles.countBtn}
                      onPress={() => updateCount(item, -1)}
                      accessibilityLabel={`Decrease count for ${item.name}`}
                    >
                      <Text style={styles.countBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.countValue}>{log?.count ?? 0}</Text>
                    <TouchableOpacity
                      style={styles.countBtn}
                      onPress={() => updateCount(item, 1)}
                      accessibilityLabel={`Increase count for ${item.name}`}
                    >
                      <Text style={styles.countBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: COLOURS.background },
  card: {
    backgroundColor: COLOURS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600', color: COLOURS.textPrimary },
  category: { fontSize: 12, color: COLOURS.textSecondary, marginTop: 2 },
  checkBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOURS.primary,
  },
  checkBtnDone: { backgroundColor: COLOURS.primary },
  checkText: { color: COLOURS.primary, fontWeight: '600', fontSize: 13 },
  checkTextDone: { color: '#fff' },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  countBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLOURS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  countValue: { fontSize: 18, fontWeight: 'bold', color: COLOURS.textPrimary, minWidth: 24, textAlign: 'center' },
});