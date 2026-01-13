"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { api } from "../lib/api";
import type { Food } from "../lib/types";
import { useDebouncedValue } from "../lib/useDebouncedValues";
import AddFoodModal from "./AddFoodModal";





type Props = {
  onAdd: (foodId: number, grams: number) => Promise<void> | void;
  disabled: boolean;
};
 




export default function FoodAutocomplete({ onAdd, disabled }: Props) {
  const [q, setQ] = useState("");
  const debounced = useDebouncedValue(q, 200);

  const [suggestions, setSuggestions] = useState<Food[]>([]);
  const [selected, setSelected] = useState<Food | null>(null);

  const [grams, setGrams] = useState("100");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const value = debounced.trim();
      if (!value) {
        setSuggestions([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const items = await api.suggestFoods(value);
        console.log("suggest query:", value, "items:", items);
    
        if (!cancelled) setSuggestions(items);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Suggest failed");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const gramsNum = useMemo(() => {
    const n = Number(grams);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(5000, Math.floor(n)));
  }, [grams]);

  const kcalPreview = useMemo(() => {
    if (!selected) return "—";
    return Math.floor((gramsNum * selected.kcal_per_100g) / 100);
  }, [selected, gramsNum]);

  async function handleAdd() {
    if (!selected) return;
    await onAdd(selected.id, gramsNum);
    setQ("");
    setSelected(null);
    setSuggestions([]);
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p="4">
      <VStack align="stretch" gap="3">
        <HStack justify="space-between" align="center">
          <Text fontWeight="600">Add food</Text>
          <AddFoodModal
            disabled={disabled}
            triggerLabel="Add custom food"
            onCreated={async () => {
              const items = await api.suggestFoods(q.trim());
              setSuggestions(items);
            }}
          />
        </HStack>

        <Box>
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSelected(null);
            }}
            placeholder='Type like "моло"'
            disabled={disabled}
          />

          <Box mt="2" borderWidth={suggestions.length > 0 ? "1px" : "0"} borderRadius="md" overflow="hidden">
            {isLoading && (
              <Box p="2">
                <Text opacity={0.7}>Loading…</Text>
              </Box>
            )}

            {!isLoading && debounced.trim() && suggestions.length === 0 && (
              <Box p="2">
                <Text opacity={0.7}>No matches</Text>
              </Box>
            )}

            {!isLoading &&
              suggestions.map((f) => (
                <Button
                  key={f.id}
                  variant="ghost"
                  justifyContent="space-between"
                  w="full"
                  borderRadius="0"
                  onClick={() => {
                    setSelected(f);
                    setQ(f.name);
                    setSuggestions([]);
                  }}
                  disabled={disabled}
                >
                  <Text>{f.name}</Text>
                  <Text opacity={0.7}>{f.kcal_per_100g} kcal/100g</Text>
                </Button>
              ))}
          </Box>

          {error && (
            <Text mt="2" color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
        </Box>

        <HStack gap="3">
          <Input
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            placeholder="grams"
            w="160px"
            disabled={disabled}
          />
          <Text opacity={0.75}>Preview: {kcalPreview} kcal</Text>
          <Box flex="1" />
          <Button onClick={handleAdd} disabled={disabled || !selected} colorPalette="blue">
            Add
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
