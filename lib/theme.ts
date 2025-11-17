// Theme system for dynamic color schemes

export type ThemeMode = 'night' | 'morning' | 'day' | 'evening';

export interface ThemeColors {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
}

export const themes: Record<ThemeMode, ThemeColors> = {
  night: {
    background: '#0A0F1C',
    cardBackground: '#0B1B2B',
    text: '#F4F4F4',
    textSecondary: '#A0A0A0',
    border: '#1A1C1F',
    accent: '#37C66D',
  },
  morning: {
    background: 'linear-gradient(135deg, #FFE5B4 0%, #FFD89B 100%)',
    cardBackground: '#FFFFFF',
    text: '#2C2C2C',
    textSecondary: '#666666',
    border: '#E0E0E0',
    accent: '#37C66D',
  },
  day: {
    background: '#F4F4F4',
    cardBackground: '#FFFFFF',
    text: '#1A1C1F',
    textSecondary: '#666666',
    border: '#E0E0E0',
    accent: '#37C66D',
  },
  evening: {
    background: 'linear-gradient(135deg, #6B5B95 0%, #4A4A6A 100%)',
    cardBackground: '#FFFFFF',
    text: '#F4F4F4',
    textSecondary: '#B0B0B0',
    border: '#4A4A6A',
    accent: '#37C66D',
  },
};

export function getEmissionColor(emission: number): string {
  if (emission < 10) return '#37C66D'; // Green
  if (emission < 20) return '#FFCF4A'; // Yellow
  return '#E84747'; // Red
}

export function getEmissionLevel(emission: number): 'Low' | 'Moderate' | 'High' {
  if (emission < 10) return 'Low';
  if (emission < 20) return 'Moderate';
  return 'High';
}

export function getBatteryColor(percent: number): string {
  if (percent < 10) return '#E84747'; // Red
  if (percent < 20) return '#FFCF4A'; // Yellow
  return '#37C66D'; // Green
}

export function getChargingStartColor(startPercent: number): string {
  if (startPercent < 15) return '#E84747'; // Red
  if (startPercent < 30) return '#FFCF4A'; // Yellow
  if (startPercent < 80) return '#37C66D'; // Green
  return '#4A90E2'; // Blue
}

