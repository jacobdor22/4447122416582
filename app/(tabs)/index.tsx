import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import StreakBadge from '@/components/habits/StreakBadge';
import EmptyState from '@/components/ui/EmptyState';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { db } from '@/db/client';
import { categories, habitLogs, habits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Habit = {
  id: number;
  name: string;
  metricType: string;
  categoryId: number;
  notes: string | null;
};

type Category = {
  id: number;
  name: string;
  colour: string;
};

type DateRange = 'all' | 'today' | 'week' | 'month';

export default function HabitsScreen() {
  const { user } = useAuth();
  const { colours: COLOURS } = useTheme();
  const router = useRouter();
  const [habitList, setHabitList] = useState<Habit[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [ready, setReady] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [activeHabitIds, setActiveHabitIds] = useState<Set<number>>(new Set());
  const [streakMap, setStreakMap] = useState<Record<number, number>>({});

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }
    loadData();
  }, [ready, user]);

  useEffect(() => {
    loadActiveHabits();
  }, [dateRange, habitList]);

  const getDateRangeFilter = () => {
    const now = new Date();
    if (dateRange === 'today') {
      const today = now.toISOString().split('T')[0];
      return { start: today, end: today };
    } else if (dateRange === 'week') {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
    } else if (dateRange === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
    }
    return null;
  };

  const loadActiveHabits = async () => {
    if (dateRange === 'all') {
      setActiveHabitIds(new Set(habitList.map(h => h.id)));
      return;
    }
    const range = getDateRangeFilter();
    if (!range) return;
    const logs = await db.select().from(habitLogs);
    const filtered = logs.filter(l => l.date >= range.start && l.date <= range.end);
    setActiveHabitIds(new Set(filtered.map(l => l.habitId)));
  };

  const calculateStreak = (logs: { habitId: number; date: string }[], habitId: number): number => {
    const dates = logs
      .filter(l => l.habitId === habitId)
      .map(l => l.date)
      .sort()
      .reverse();

    if (dates.length === 0) return 0;

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
      const expectedStr = expected.toISOString().split('T')[0];
      if (dates[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const loadData = async () => {
    const cats = await db.select().from(categories).where(eq(categories.userId, user!.id));
    const habs = await db.select().from(habits).where(eq(habits.userId, user!.id));
    const logs = await db.select().from(habitLogs);
    setCategoryList(cats);
    setHabitList(habs);
    const streaks: Record<number, number> = {};
    for (const hab of habs) {
      streaks[hab.id] = calculateStreak(logs, hab.id);
    }
    setStreakMap(streaks);
  };

  const filteredHabits = habitList.filter(h => {
    const matchesText = h.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === null || h.categoryId === selectedCategory;
    const matchesDate = dateRange === 'all' || activeHabitIds.has(h.id);
    return matchesText && matchesCategory && matchesDate;
  });

  const handleAdd = async (data: { name: string; notes: string; metricType: string; categoryId: number }) => {
    await db.insert(habits).values({
      userId: user!.id,
      name: data.name,
      notes: data.notes,
      metricType: data.metricType,
      categoryId: data.categoryId,
      createdAt: new Date().toISOString(),
    });
    setShowForm(false);
    loadData();
  };

  const handleEdit = async (data: { name: string; notes: string; metricType: string; categoryId: number }) => {
    if (!editingHabit) return;
    await db.update(habits).set({
      name: data.name,
      notes: data.notes,
      metricType: data.metricType,
      categoryId: data.categoryId,
    }).where(eq(habits.id, editingHabit.id));
    setEditingHabit(null);
    setShowForm(false);
    loadData();
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Habit', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await db.delete(habits).where(eq(habits.id, id));
          loadData();
        }
      },
    ]);
  };

  const getCategoryById = (id: number) =>
    categoryList.find((c) => c.id === id) ?? { name: 'Unknown', colour: '#ccc' };

  return (
    <ScrollView style={[styles.container, { backgroundColor: COLOURS.background }]}>
      <ScreenHeader title="My Habits" subtitle={`${habitList.length} habits tracked`} />
      {!showForm && (
        <PrimaryButton title="+ Add Habit" onPress={() => { setEditingHabit(null); setShowForm(true); }} />
      )}
      {showForm && (
        <HabitForm
          categories={categoryList}
          initialName={editingHabit?.name}
          initialNotes={editingHabit?.notes ?? ''}
          initialMetricType={editingHabit?.metricType}
          initialCategoryId={editingHabit?.categoryId}
          onSubmit={editingHabit ? handleEdit : handleAdd}
          submitLabel={editingHabit ? 'Update Habit' : 'Add Habit'}
        />
      )}
      {!showForm && (
        <>
          <TextInput
            style={[styles.searchInput, { backgroundColor: COLOURS.card, borderColor: COLOURS.border, color: COLOURS.textPrimary }]}
            placeholder="Search habits..."
            placeholderTextColor={COLOURS.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            accessibilityLabel="Search habits"
          />
          <Text style={[styles.filterLabel, { color: COLOURS.textSecondary }]}>Filter by date</Text>
          <View style={styles.dateRow}>
            {(['all', 'today', 'week', 'month'] as DateRange[]).map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.dateBtn, { borderColor: COLOURS.border, backgroundColor: COLOURS.card }, dateRange === d && { backgroundColor: COLOURS.primary, borderColor: COLOURS.primary }]}
                onPress={() => setDateRange(d)}
                accessibilityLabel={`Filter by ${d}`}
              >
                <Text style={[styles.dateText, { color: COLOURS.textPrimary }, dateRange === d && styles.dateTextActive]}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.filterLabel, { color: COLOURS.textSecondary }]}>Filter by category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
            <TouchableOpacity
              style={[styles.filterBtn, { borderColor: COLOURS.border, backgroundColor: COLOURS.card }, selectedCategory === null && { backgroundColor: COLOURS.primary, borderColor: COLOURS.primary }]}
              onPress={() => setSelectedCategory(null)}
              accessibilityLabel="Show all categories"
            >
              <Text style={[styles.filterText, { color: COLOURS.textPrimary }, selectedCategory === null && styles.filterTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {categoryList.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.filterBtn, { borderColor: COLOURS.border, backgroundColor: COLOURS.card }, selectedCategory === cat.id && { backgroundColor: cat.colour, borderColor: cat.colour }]}
                onPress={() => setSelectedCategory(cat.id)}
                accessibilityLabel={`Filter by ${cat.name}`}
              >
                <Text style={[styles.filterText, { color: COLOURS.textPrimary }, selectedCategory === cat.id && { color: '#fff' }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
      {filteredHabits.length === 0 && !showForm ? (
        <EmptyState
          title="No habits found"
          message={searchText ? 'Try a different search' : 'Tap + Add Habit to get started'}
        />
      ) : (
        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const cat = getCategoryById(item.categoryId);
            const streak = streakMap[item.id] ?? 0;
            return (
              <View>
                <HabitCard
                  name={item.name}
                  category={cat.name}
                  categoryColour={cat.colour}
                  metricType={item.metricType}
                  onEdit={() => { setEditingHabit(item); setShowForm(true); }}
                  onDelete={() => handleDelete(item.id)}
                />
                {streak > 0 && (
                  <View style={styles.streakContainer}>
                    <StreakBadge streak={streak} />
                  </View>
                )}
              </View>
            );
          }}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  searchInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  filterLabel: { fontSize: 12, fontWeight: '700', marginBottom: 8 },
  dateRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  dateBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  dateText: { fontSize: 12, fontWeight: '600' },
  dateTextActive: { color: '#fff' },
  categoryFilter: { marginBottom: 16 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterBtnActive: { },
  filterText: { fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  streakContainer: { marginTop: -8, marginBottom: 8, paddingLeft: 16 },
});