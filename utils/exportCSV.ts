import { db } from '@/db/client';
import { categories, habitLogs, habits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportHabitsCSV(userId: number) {
  // fetch all habits and categories for this user
  const habs = await db.select().from(habits).where(eq(habits.userId, userId));
  const cats = await db.select().from(categories).where(eq(categories.userId, userId));
  const logs = await db.select().from(habitLogs);

  // helper to look up category name by id
  const getCategoryName = (categoryId: number) =>
    cats.find(c => c.id === categoryId)?.name ?? 'Unknown';

  // helper to look up habit name by id
  const getHabitName = (habitId: number) =>
    habs.find(h => h.id === habitId)?.name ?? 'Unknown';

  // build rows — first row is the header, rest is log data
  const rows = [
    ['Date', 'Habit', 'Category', 'Completed', 'Count', 'Notes'],
    ...logs
      // only include logs that belong to this user's habits
      .filter(l => habs.some(h => h.id === l.habitId))
      .map(l => [
        l.date,
        getHabitName(l.habitId),
        getCategoryName(habs.find(h => h.id === l.habitId)?.categoryId ?? 0),
        l.completed ? 'Yes' : 'No',
        l.count?.toString() ?? '',
        l.notes ?? '',
      ]),
  ];

  // join everything into a CSV string
  const csvContent = rows.map(row => row.join(',')).join('\n');
  const path = FileSystem.cacheDirectory + 'habits_export.csv';

  // write to device cache then share
  await FileSystem.writeAsStringAsync(path, csvContent, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(path, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Habits CSV',
    });
  }
}