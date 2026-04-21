import FactCard from '@/components/ui/FactCard';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { db } from '@/db/client';
import { habitLogs, habits } from '@/db/schema';
import { fetchDateFact, fetchStreakFact } from '@/utils/fetchNumberFact';
import { eq } from 'drizzle-orm';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

type Period = 'daily' | 'weekly' | 'monthly';

const screenWidth = Dimensions.get('window').width - 48;

export default function InsightsScreen() {
  const { user } = useAuth();
  const { colours: COLOURS } = useTheme();
  const [period, setPeriod] = useState<Period>('weekly');
  const [chartData, setChartData] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
  const [totalLogs, setTotalLogs] = useState(0);
  const [mostActive, setMostActive] = useState('None');
  const [completionRate, setCompletionRate] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [dateFact, setDateFact] = useState('Loading motivation...');
  const [streakFact, setStreakFact] = useState('Loading tip...');
  const [loadingDateFact, setLoadingDateFact] = useState(true);
  const [loadingStreakFact, setLoadingStreakFact] = useState(true);

  // reload data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
      loadFacts();
    }, [user, period])
  );

  // fetch two separate motivational tips from the API
  const loadFacts = async () => {
    setLoadingDateFact(true);
    setLoadingStreakFact(true);
    const date = await fetchDateFact();
    setDateFact(date);
    setLoadingDateFact(false);
    const streak = await fetchStreakFact(bestStreak);
    setStreakFact(streak);
    setLoadingStreakFact(false);
  };

  const loadData = async () => {
    if (!user) return;

    // only get habits that belong to this user
    const habs = await db.select().from(habits).where(eq(habits.userId, user.id));

    // filter logs to only include this user's habits
    const habIds = habs.map(h => h.id);
    const allLogs = await db.select().from(habitLogs);
    const logs = habIds.length > 0
      ? allLogs.filter(l => habIds.includes(l.habitId))
      : [];

    const now = new Date();

    // filter logs down to the selected time period
    let filtered = logs;
    if (period === 'daily') {
      const today = now.toISOString().split('T')[0];
      filtered = logs.filter(l => l.date === today);
    } else if (period === 'weekly') {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      filtered = logs.filter(l => l.date >= start.toISOString().split('T')[0]);
    } else {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = logs.filter(l => l.date >= start.toISOString().split('T')[0]);
    }

    // build chart data — one bar per habit
    const labels = habs.map(h => h.name.length > 6 ? h.name.slice(0, 6) + '..' : h.name);
    const values = habs.map(h =>
      filtered.filter(l => l.habitId === h.id).reduce(
        (sum, l) => sum + (l.completed ? 1 : (l.count ?? 0)), 0
      )
    );

    setChartData({ labels, values });
    setTotalLogs(filtered.length);

    const maxIndex = values.indexOf(Math.max(...values));
    setMostActive(habs[maxIndex]?.name ?? 'None');

    // completion rate is logs vs number of habits
    const rate = habs.length > 0 ? Math.round((filtered.length / habs.length) * 100) : 0;
    setCompletionRate(rate);

    // go back day by day to find the longest current streak
    if (habs.length > 0) {
      let maxStreak = 0;
      for (const hab of habs) {
        const dates = logs
          .filter(l => l.habitId === hab.id)
          .map(l => l.date)
          .sort()
          .reverse();
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < dates.length; i++) {
          const expected = new Date(today);
          expected.setDate(today.getDate() - i);
          if (dates[i] === expected.toISOString().split('T')[0]) {
            streak++;
          } else break;
        }
        if (streak > maxStreak) maxStreak = streak;
      }
      setBestStreak(maxStreak);
      const fact = await fetchStreakFact(maxStreak);
      setStreakFact(fact);
      setLoadingStreakFact(false);
    } else {
      setLoadingStreakFact(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: COLOURS.background }]}>
      <ScreenHeader title="Insights" subtitle="Your habit progress" />

      <FactCard title="Daily motivation" fact={dateFact} loading={loadingDateFact} />
      <FactCard title="Today's tip" fact={streakFact} loading={loadingStreakFact} />

      <View style={styles.periodRow}>
        {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodBtn, { borderColor: COLOURS.border }, period === p && { backgroundColor: COLOURS.primary, borderColor: COLOURS.primary }]}
            onPress={() => setPeriod(p)}
            accessibilityLabel={`View ${p} insights`}
          >
            <Text style={[styles.periodText, { color: COLOURS.textPrimary }, period === p && styles.periodTextActive]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: COLOURS.card }]}>
          <Text style={[styles.statValue, { color: COLOURS.primary }]}>{totalLogs}</Text>
          <Text style={[styles.statLabel, { color: COLOURS.textSecondary }]}>Total logs</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLOURS.card }]}>
          <Text style={[styles.statValue, { color: COLOURS.primary }]}>{completionRate}%</Text>
          <Text style={[styles.statLabel, { color: COLOURS.textSecondary }]}>Completion</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLOURS.card }]}>
          <Text style={[styles.statValue, { color: COLOURS.primary }]} numberOfLines={1}>{mostActive}</Text>
          <Text style={[styles.statLabel, { color: COLOURS.textSecondary }]}>Most active</Text>
        </View>
      </View>

      <View style={[styles.chartCard, { backgroundColor: COLOURS.card }]}>
        <Text style={[styles.chartTitle, { color: COLOURS.textPrimary }]}>Completions by habit</Text>
        {chartData.labels.length > 0 ? (
          <BarChart
            data={{
              labels: chartData.labels,
              datasets: [{ data: chartData.values.length > 0 ? chartData.values : [0] }],
            }}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: COLOURS.card,
              backgroundGradientFrom: COLOURS.card,
              backgroundGradientTo: COLOURS.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
              labelColor: () => COLOURS.textSecondary,
              barPercentage: 0.6,
            }}
            style={{ borderRadius: 8 }}
          />
        ) : (
          <Text style={[styles.noData, { color: COLOURS.textSecondary }]}>No data for this period</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  periodRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodTextActive: { color: '#fff' },
  periodText: { fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 11, marginTop: 4 },
  chartCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  noData: { textAlign: 'center', paddingVertical: 40 },
});