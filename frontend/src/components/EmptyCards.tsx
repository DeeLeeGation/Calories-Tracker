"use client";

import { Box, SimpleGrid, Text } from "@chakra-ui/react";

function EmptyCard({ title }: { title: string }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p="4">
      <Text fontWeight="600">{title}</Text>
      <Text mt="2" opacity={0.6}>
        Empty placeholder
      </Text>
      <Box mt="4" h="24px" borderRadius="md" bg="blackAlpha.50" />
    </Box>
  );
}

export default function EmptyCards() {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
      <EmptyCard title="Goals" />
      <EmptyCard title="Macros" />
      <EmptyCard title="Trends" />
    </SimpleGrid>
  );
}
