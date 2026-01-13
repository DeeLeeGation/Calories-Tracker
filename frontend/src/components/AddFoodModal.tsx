"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Field,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { api } from "../lib/api";

type Props = {
  onCreated: () => Promise<void> | void;
  disabled: boolean;
  triggerLabel?: string;
};

function toIntOrNull(v: string): number | null {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const x = Math.floor(n);
  return x < 0 ? null : x;
}

export default function AddFoodModal({ onCreated, disabled }: Props) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [advanced, setAdvanced] = useState(false);

  const [p, setP] = useState("");
  const [f, setF] = useState("");
  const [c, setC] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(() => {
    const n = name.trim().length > 0;
    const kcalNum = toIntOrNull(kcal);
    return n && kcalNum !== null;
  }, [name, kcal]);

  async function handleSave() {
    setError(null);

    const kcalNum = toIntOrNull(kcal);
    if (!name.trim() || kcalNum === null) {
      setError("Name and kcal/100g are required");
      return;
    }

    const payload = {
      name: name.trim(),
      kcal_per_100g: kcalNum,
      protein_per_100g: advanced ? toIntOrNull(p) : null,
      fat_per_100g: advanced ? toIntOrNull(f) : null,
      carbs_per_100g: advanced ? toIntOrNull(c) : null,
    };

    setSaving(true);
    try {
      await api.createFood(payload);
      await onCreated();

      setOpen(false);
      setName("");
      setKcal("");
      setAdvanced(false);
      setP("");
      setF("");
      setC("");
    } catch (e: any) {
      setError(e?.message ?? "Failed to create food");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button variant="outline" disabled={disabled}>
          Add custiom food
        </Button>
      </Dialog.Trigger>

      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Add food to database</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <VStack align="stretch" gap="4">
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Protein bar X"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>kcal per 100g</Field.Label>
                <Input
                  value={kcal}
                  onChange={(e) => setKcal(e.target.value)}
                  placeholder="e.g. 320"
                  inputMode="numeric"
                />
              </Field.Root>

              <Checkbox.Root
                checked={advanced}
                onCheckedChange={(e) => setAdvanced(!!e.checked)}
              >
                <Checkbox.Control />
                <Checkbox.Label>I know macros (optional)</Checkbox.Label>
              </Checkbox.Root>
              {advanced && (
                <HStack gap="3">
                  <Field.Root>
                    <Field.Label>Protein</Field.Label>
                    <Input value={p} onChange={(e) => setP(e.target.value)} placeholder="g/100g" inputMode="numeric" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Fat</Field.Label>
                    <Input value={f} onChange={(e) => setF(e.target.value)} placeholder="g/100g" inputMode="numeric" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Carbs</Field.Label>
                    <Input value={c} onChange={(e) => setC(e.target.value)} placeholder="g/100g" inputMode="numeric" />
                  </Field.Root>
                </HStack>
              )}

              {error && (
                <Box>
                  <Text color="red.500" fontSize="sm">
                    {error}
                  </Text>
                </Box>
              )}
            </VStack>
          </Dialog.Body>

          <Dialog.Footer>
            <HStack gap="3" w="full" justify="flex-end">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                colorPalette="blue"
                onClick={handleSave}
                disabled={!canSave || saving}
              >
                {saving ? "Saving…" : "Save"}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
