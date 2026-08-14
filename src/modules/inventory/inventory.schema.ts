import { z } from "zod";

export const createInventorySchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  blindMode: z.boolean().default(false),
  // Se omitido, o inventário inclui todos os produtos ativos (ex: inventário geral).
  productIds: z.array(z.string().uuid()).optional(),
});

export const countItemSchema = z.object({
  countedQty: z.number().int().min(0, "Quantidade não pode ser negativa"),
  note: z.string().optional(),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type CountItemInput = z.infer<typeof countItemSchema>;
