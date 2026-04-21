import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import HabitsScreen from '../app/(tabs)/index';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'test@test.com' },
  }),
}));

jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    colours: {
      primary: '#16A34A',
      textPrimary: '#1a1a1a',
      textSecondary: '#888888',
      border: '#dddddd',
      card: '#ffffff',
      background: '#f5f5f5',
      danger: '#FF6584',
      warning: '#FFB347',
      success: '#43C59E',
    },
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

jest.mock('../db/client', () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([
          { id: 1, name: 'Morning Run', metricType: 'boolean', categoryId: 1, notes: null },
          { id: 2, name: 'Read 30 mins', metricType: 'boolean', categoryId: 2, notes: null },
        ]),
      }),
    }),
  },
}));

describe('HabitsScreen', () => {
  it('renders the habits list screen', async () => {
    const { getByText } = render(<HabitsScreen />);

    await waitFor(() => {
      expect(getByText('My Habits')).toBeTruthy();
    });
  });
});