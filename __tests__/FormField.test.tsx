import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import FormField from '../components/ui/FormField';

jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    colours: {
      primary: '#16A34A',
      textPrimary: '#1a1a1a',
      textSecondary: '#888888',
      border: '#dddddd',
      card: '#ffffff',
      background: '#f5f5f5',
    },
  }),
}));

describe('FormField', () => {
  it('renders correctly with label and placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <FormField
        label="Email"
        placeholder="you@example.com"
        value=""
        onChangeText={() => {}}
      />
    );

    expect(getByText('Email')).toBeTruthy();
    expect(getByPlaceholderText('you@example.com')).toBeTruthy();
  });

  it('fires onChangeText when user types', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <FormField
        label="Email"
        placeholder="you@example.com"
        value=""
        onChangeText={mockOnChange}
      />
    );

    fireEvent.changeText(getByPlaceholderText('you@example.com'), 'test@test.com');
    expect(mockOnChange).toHaveBeenCalledWith('test@test.com');
  });
});