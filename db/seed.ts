import { db } from './client';
import { categories, habitLogs, habits, targets, users } from './schema';

export async function seedIfEmpty() {
  // only seed if the database is empty to avoid duplicate data
  const existing = await db.select().from(habits);
  if (existing.length > 0) return;

  // create a demo user for testing
  await db.insert(users).values([
    { email: 'demo@example.com', passwordHash: 'demo123', createdAt: '2024-01-01' },
  ]);

  // set up default categories with colours and icons
  await db.insert(categories).values([
    { userId: 1, name: 'Fitness', colour: '#16A34A', icon: 'Run' },
    { userId: 1, name: 'Learning', colour: '#43C59E', icon: 'Read' },
    { userId: 1, name: 'Health', colour: '#FF6584', icon: 'Health' },
    { userId: 1, name: 'Mindfulness', colour: '#FFB347', icon: 'Mind' },
  ]);

  // add sample habits across different categories
  await db.insert(habits).values([
    { userId: 1, categoryId: 1, name: 'Morning Run', metricType: 'boolean', createdAt: '2024-01-01' },
    { userId: 1, categoryId: 2, name: 'Read 30 mins', metricType: 'boolean', createdAt: '2024-01-01' },
    { userId: 1, categoryId: 3, name: 'Drink 2L Water', metricType: 'count', createdAt: '2024-01-01' },
    { userId: 1, categoryId: 4, name: 'Meditate', metricType: 'boolean', createdAt: '2024-01-01' },
  ]);

  // generate 30 days of random log data to populate charts and insights
  const today = new Date();
  const logs = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    if (Math.random() > 0.3) logs.push({ habitId: 1, date: dateStr, completed: 1, count: null, notes: null });
    if (Math.random() > 0.4) logs.push({ habitId: 2, date: dateStr, completed: 1, count: null, notes: null });
    logs.push({ habitId: 3, date: dateStr, completed: null, count: Math.floor(Math.random() * 3) + 1, notes: null });
    if (Math.random() > 0.5) logs.push({ habitId: 4, date: dateStr, completed: 1, count: null, notes: null });
  }

  await db.insert(habitLogs).values(logs);

  // set weekly and monthly targets for the demo user
  await db.insert(targets).values([
    { userId: 1, habitId: 1, period: 'weekly', targetValue: 5 },
    { userId: 1, habitId: 2, period: 'weekly', targetValue: 5 },
    { userId: 1, habitId: null, period: 'monthly', targetValue: 20 },
  ]);
}