"use client";

import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import type { LogEntry } from "../lib/types";

type Props = {
  entries: LogEntry[];
  onDelete: (id: number) => Promise<void> | void;
  loading: boolean;
};

export default function DayLog({ entries, onDelete, loading }: Props) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p="4">
      <HStack mb="3" gap="3">
        <Text fontWeight="600">Today log</Text>
        <Box flex="1" />
        {loading && <Text opacity={0.7}>Loading…</Text>}
      </HStack>

      {entries.length === 0 ? (
        <Text opacity={0.7}>No entries yet</Text>
      ) : (
        <VStack align="stretch" gap="2">
          {entries.map((e) => (
            <HStack
              key={e.id}
              borderWidth="1px"
              borderRadius="md"
              p="3"
              gap="3"
              justify="space-between"
            >
              <Box>
                <Text fontWeight="500">{e.food.name}</Text>
                <Text opacity={0.7} fontSize="sm">
                  {e.grams} g · {e.kcal_total} kcal
                </Text>
              </Box>

              <Button size="sm" variant="outline" onClick={() => onDelete(e.id)} disabled={loading}>
                Delete
              </Button>
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
}
