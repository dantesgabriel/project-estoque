import { z } from "zod";

const adjustmentReasons = [
  "PERDA",
  "VENCIMENTO",
  "USO_NAO_REGISTRADO",
  "ERRO_CADASTRO",
  "DESCARTE",
  "OUTRO",
] as const;

// Ajuste vindo de uma divergência de inventário.
export const createAdjustmentFromInventorySchema = z.object({
  inventoryItemId: z.string().uuid(),
  reason: z.enum(adjustmentReasons),
  note: z.string().optional(),
});

// Ajuste manual, sem vínculo com inventário (ex: correção pontual de cadastro).
export const createManualAdjustmentSchema = z.object({
  productId: z.string().uuid(),
  newQty: z.number().int().min(0, "Quantidade não pode ser negativa"),
  reason: z.enum(adjustmentReasons),
  note: z.string().optional(),
});

export type CreateAdjustmentFromInventoryInput = z.infer<typeof createAdjustmentFromInventorySchema>;
export type CreateManualAdjustmentInput = z.infer<typeof createManualAdjustmentSchema>;
