import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
