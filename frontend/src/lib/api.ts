import type { DaySummary, Food, LogEntry } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_CAL_API_BASE ?? "http://localhost:8000";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  suggestFoods: (q: string) => http<Food[]>(`/foods/suggest?q=${encodeURIComponent(q)}`),

  createFood: (payload: {
    name: string;
    kcal_per_100g: number;
    protein_per_100g?: number | null;
    fat_per_100g?: number | null;
    carbs_per_100g?: number | null;
  }) =>
    http<Food>(`/foods`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  addLog: (payload: { date: string; food_id: number; grams: number }) =>
    http<LogEntry>(`/log`, { method: "POST", body: JSON.stringify(payload) }),

  listLog: (date: string) => http<LogEntry[]>(`/log?date=${encodeURIComponent(date)}`),

  deleteLog: (id: number) => http<{ ok: boolean }>(`/log/${id}`, { method: "DELETE" }),

  daySummary: (date: string) => http<DaySummary>(`/summary/day?date=${encodeURIComponent(date)}`),
};
