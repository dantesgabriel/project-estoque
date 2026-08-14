import { z } from "zod";

const movementReasons = [
  "COMPRA",
  "USO_INTERNO",
  "ATENDIMENTO",
  "PERDA",
  "DESCARTE",
  "VENCIMENTO",
  "OUTRO",
] as const;

export const createMovementSchema = z.object({
  productId: z.string().uuid("Produto inválido"),
  quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
  reason: z.enum(movementReasons),
  supplier: z.string().optional(),
  invoiceNumber: z.string().optional(),
  note: z.string().optional(),
});

export const listMovementsQuerySchema = z.object({
  productId: z.string().uuid().optional(),
  type: z.enum(["IN", "OUT"]).optional(),
});

export type CreateMovementInput = z.infer<typeof createMovementSchema>;
export type ListMovementsQuery = z.infer<typeof listMovementsQuerySchema>;
