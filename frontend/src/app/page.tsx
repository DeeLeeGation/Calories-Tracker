"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import EmptyCards from "../components/EmptyCards";
import FoodAutocomplete from "../components/FoodAutocomplete";
import DayLog from "../components/DayLog";
import { api } from "../lib/api";
import { todayISO } from "../lib/date";
import type { DaySummary, LogEntry } from "../lib/types";
import AddFoodModal from "../components/AddFoodModal";



export default function HomePage() {
  const [date] = useState(() => todayISO());
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [summary, setSummary] = useState<DaySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setTopError(null);
    try {
      const [log, sum] = await Promise.all([api.listLog(date), api.daySummary(date)]);
      setEntries(log);
      setSummary(sum);
    } catch (e: any) {
      setTopError(e?.message ?? "API failed");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onAdd = useCallback(
    async (foodId: number, grams: number) => {
      await api.addLog({ date, food_id: foodId, grams });
      await refresh();
    },
    [date, refresh]
  );

  const onDelete = useCallback(
    async (id: number) => {
      await api.deleteLog(id);
      await refresh();
    },
    [refresh]
  );

  const totalText = useMemo(() => {
    if (!summary) return "—";
    return `${summary.kcal_total} kcal`;
  }, [summary]);

  return (
    <Container maxW="6xl" py="8">
      <VStack align="stretch" gap="6">
        <Box>
          <Heading size="lg">Calorie Tracker</Heading>
          <Text opacity={0.75}>Date: {date} · Total: {totalText}</Text>
          {topError && (
            <Text mt="2" color="red.500" fontSize="sm">
              {topError}
            </Text>
          )}
        </Box>

        <EmptyCards />
        <FoodAutocomplete onAdd={onAdd} disabled={loading} />
        <DayLog entries={entries} onDelete={onDelete} loading={loading} />
      </VStack>
    </Container>
  );
}
