import { DARK_COLOURS, LIGHT_COLOURS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const Colors = {
  light: LIGHT_COLOURS,
  dark: DARK_COLOURS,
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof LIGHT_COLOURS
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}