export type Food = {
  id: number;
  name: string;
  kcal_per_100g: number;
  protein_per_100g?: number | null;
  fat_per_100g?: number | null;
  carbs_per_100g?: number | null;
};

export type LogEntry = {
  id: number;
  date: string;
  grams: number;
  food: Food;
  kcal_total: number;
};

export type DaySummary = {
  date: string;
  kcal_total: number;
  protein_total: number;
  fat_total: number;
  carbs_total: number;
};
