
import { UserProfile, Gender, ActivityLevel, WeightEntry } from '../types';
import { ACTIVITY_FACTORS } from '../constants';

export const calculateBMI = (weight: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return Number((weight / (heightM * heightM)).toFixed(1));
};

export const calculateBMR = (user: UserProfile): number => {
  const { weight, height, age, gender } = user;
  if (gender === Gender.MALE) {
    return Number((10 * weight + 6.25 * height - 5 * age + 5).toFixed(0));
  } else {
    return Number((10 * weight + 6.25 * height - 5 * age - 161).toFixed(0));
  }
};

export const calculateTDEE = (user: UserProfile): number => {
  const bmr = calculateBMR(user);
  const factor = ACTIVITY_FACTORS[user.activityLevel];
  return Number((bmr * factor).toFixed(0));
};

export const getBMICategory = (bmi: number) => {
  // Divisão em 3 cores original:
  // Normal/Abaixo (Esmeralda) | Sobrepeso (Amarelo) | Obesidade (Vermelho)
  if (bmi < 18.5) return { label: 'Abaixo do peso', color: 'text-emerald-500', hex: '#10b981' };
  if (bmi < 25) return { label: 'Peso ideal', color: 'text-emerald-500', hex: '#10b981' };
  if (bmi < 30) return { label: 'Sobrepeso', color: 'text-yellow-500', hex: '#fbbf24' };
  return { label: 'Obesidade', color: 'text-red-500', hex: '#ef4444' };
};

export const exportToCSV = (history: WeightEntry[]) => {
  const headers = ['Data', 'Peso (kg)', 'IMC'];
  const rows = history.map(h => [h.date, h.weight, h.bmi]);
  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n" 
    + rows.map(e => e.join(",")).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "biolife_evolucao.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
