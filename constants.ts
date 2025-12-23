
import { ActivityLevel } from './types';

export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHTLY_ACTIVE]: 1.375,
  [ActivityLevel.MODERATELY_ACTIVE]: 1.55,
  [ActivityLevel.VERY_ACTIVE]: 1.725,
  [ActivityLevel.EXTRA_ACTIVE]: 1.9,
};

export const BMI_CATEGORIES = [
  { max: 18.5, label: 'Abaixo do peso', color: 'text-blue-600', bg: 'bg-blue-100' },
  { max: 25, label: 'Peso ideal', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { max: 30, label: 'Sobrepeso', color: 'text-amber-600', bg: 'bg-amber-100' },
  { max: 100, label: 'Obesidade', color: 'text-rose-600', bg: 'bg-rose-100' },
];

export const APP_COLORS = {
  mint: '#10b981', // Emerald 500
  mintLight: '#ecfdf5', // Emerald 50
  mintDark: '#047857', // Emerald 700
  white: '#FFFFFF',
  text: '#0f172a' // Slate 900 para máxima nitidez
};
