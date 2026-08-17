import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  sku: z.string().min(1, "SKU obrigatório"),
  barcode: z.string().optional(),
  categoryId: z.string().uuid("Categoria inválida"),
  unit: z.string().min(1, "Unidade de medida obrigatória"),
  minStock: z.number().int().min(0).default(0),
  maxStock: z.number().int().min(0).optional(),
  location: z.string().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  sku: z.string().min(1).optional(),
  barcode: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  unit: z.string().min(1).optional(),
  minStock: z.number().int().min(0).optional(),
  maxStock: z.number().int().min(0).optional(),
  location: z.string().optional(),
  active: z.boolean().optional(),
});

// Filtros da listagem (seção 7.3 do projeto): nome, categoria, estoque baixo, zerados, ativos/inativos.
export const listProductsQuerySchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  lowStock: z.coerce.boolean().optional(),
  zeroStock: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
