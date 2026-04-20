import TargetCard from '@/components/targets/TargetCard';
import TargetForm from '@/components/targets/TargetForm';
import EmptyState from '@/components/ui/EmptyState';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { COLOURS } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/db/client';
import { habitLogs, habits, targets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet } from 'react-native';

type Target = {
  id: number;
  period: string;
  targetValue: number;
  habitId: number | null;
};

type Habit = {
  id: number;
  name: string;
};

export default function TargetsScreen() {
  const { user } = useAuth();
  const [targetList, setTargetList] = useState<Target[]>([]);
  const [habitList, setHabitList] = useState<Habit[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const [showForm, setShowForm] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const getDateRange = (period: string) => {
    const now = new Date();
    if (period === 'weekly') {
      const day = now.getDay();
      const start = new Date(now);
      start.setDate(now.getDate() - day);
      return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
    } else {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
    }
  };

  const loadData = async () => {
    if (!user) return;
    const tgts = await db.select().from(targets).where(eq(targets.userId, user.id));
    const habs = await db.select().from(habits).where(eq(habits.userId, user.id));
    setTargetList(tgts);
    setHabitList(habs);

    const progress: Record<number, number> = {};
    for (const target of tgts) {
      const { start, end } = getDateRange(target.period);
      const logs = await db.select().from(habitLogs);
      const filtered = logs.filter(l => l.date >= start && l.date <= end);
      if (target.habitId) {
        const habitLogs2 = filtered.filter(l => l.habitId === target.habitId);
        progress[target.id] = habitLogs2.reduce((sum, l) => sum + (l.completed ? 1 : (l.count ?? 0)), 0);
      } else {
        progress[target.id] = filtered.reduce((sum, l) => sum + (l.completed ? 1 : (l.count ?? 0)), 0);
      }
    }
    setProgressMap(progress);
  };

  const handleAdd = async (data: { period: string; targetValue: number; habitId: number | null }) => {
    await db.insert(targets).values({
      userId: user!.id,
      period: data.period,
      targetValue: data.targetValue,
      habitId: data.habitId,
    });
    setShowForm(false);
    loadData();
  };

  const handleEdit = async (data: { period: string; targetValue: number; habitId: number | null }) => {
    if (!editingTarget) return;
    await db.update(targets).set({
      period: data.period,
      targetValue: data.targetValue,
      habitId: data.habitId,
    }).where(eq(targets.id, editingTarget.id));
    setEditingTarget(null);
    setShowForm(false);
    loadData();
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Target', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await db.delete(targets).where(eq(targets.id, id));
          loadData();
        }
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Targets" subtitle={`${targetList.length} targets set`} />
      {!showForm && (
        <PrimaryButton
          title="+ Add Target"
          onPress={() => { setEditingTarget(null); setShowForm(true); }}
        />
      )}
      {showForm && (
        <TargetForm
          habits={habitList}
          initialPeriod={editingTarget?.period}
          initialTargetValue={editingTarget?.targetValue.toString()}
          initialHabitId={editingTarget?.habitId}
          onSubmit={editingTarget ? handleEdit : handleAdd}
          submitLabel={editingTarget ? 'Update Target' : 'Add Target'}
        />
      )}
      {targetList.length === 0 && !showForm ? (
        <EmptyState title="No targets yet" message="Tap + Add Target to set a goal" />
      ) : (
        <FlatList
          data={targetList}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TargetCard
              period={item.period}
              targetValue={item.targetValue}
              currentValue={progressMap[item.id] ?? 0}
              habitName={habitList.find(h => h.id === item.habitId)?.name}
              onEdit={() => { setEditingTarget(item); setShowForm(true); }}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: COLOURS.background },
});