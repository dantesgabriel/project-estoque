import { z } from "zod";

const optionalText = z.string().trim().min(1).optional();

export const createSupplierSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto"),
  document: optionalText,
  contactName: optionalText,
  email: z.string().email("Email inválido").optional(),
  phone: optionalText,
});

export const updateSupplierSchema = createSupplierSchema.partial().extend({
  active: z.boolean().optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
