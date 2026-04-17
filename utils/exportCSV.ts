import { db } from '@/db/client';
import { categories, habitLogs, habits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportHabitsCSV(userId: number) {
  const habs = await db.select().from(habits).where(eq(habits.userId, userId));
  const cats = await db.select().from(categories).where(eq(categories.userId, userId));
  const logs = await db.select().from(habitLogs);

  const getCategoryName = (categoryId: number) =>
    cats.find(c => c.id === categoryId)?.name ?? 'Unknown';

  const getHabitName = (habitId: number) =>
    habs.find(h => h.id === habitId)?.name ?? 'Unknown';

  const rows = [
    ['Date', 'Habit', 'Category', 'Completed', 'Count', 'Notes'],
    ...logs
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

  const csvContent = rows.map(row => row.join(',')).join('\n');
  const fileUri = FileSystem.documentDirectory + 'habits_export.csv';

  await FileSystem.writeAsStringAsync(fileUri, csvContent, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Habits CSV',
    });
  }
}