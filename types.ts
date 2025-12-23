
export enum Gender {
  MALE = 'Masculino',
  FEMALE = 'Feminino'
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentário',
  LIGHTLY_ACTIVE = 'Levemente Ativo',
  MODERATELY_ACTIVE = 'Moderadamente Ativo',
  VERY_ACTIVE = 'Muito Ativo',
  EXTRA_ACTIVE = 'Atleta / Extremamente Ativo'
}

export enum Goal {
  LOSE = 'Emagrecer',
  MAINTAIN = 'Manter Peso',
  GAIN = 'Ganhar Massa'
}

export interface UserProfile {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  bmi: number;
}

export interface Meal {
  title: string;
  description: string;
  items: string[];
}

export interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  snack: Meal;
  dinner: Meal;
  calories: number;
}
