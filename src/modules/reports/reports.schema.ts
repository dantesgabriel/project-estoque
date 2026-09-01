import { z } from "zod";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato AAAA-MM-DD").optional();
const uuid = z.string().uuid().optional();

export const movementsReportQuerySchema = z.object({
  from: date, to: date, productId: uuid, categoryId: uuid,
  reason: z.enum(["COMPRA", "USO_INTERNO", "ATENDIMENTO", "PERDA", "DESCARTE", "VENCIMENTO", "OUTRO"]).optional(),
  type: z.enum(["IN", "OUT"]).optional(),
});

export const adjustmentsReportQuerySchema = z.object({
  from: date, to: date, productId: uuid,
  reason: z.enum(["PERDA", "VENCIMENTO", "USO_NAO_REGISTRADO", "ERRO_CADASTRO", "DESCARTE", "OUTRO"]).optional(),
});

export const consumptionReportQuerySchema = z.object({
  from: date, to: date, productId: uuid, tutorId: uuid, petId: uuid,
  groupBy: z.enum(["product", "tutor", "pet"]).default("product"),
});

export type MovementsReportQuery = z.infer<typeof movementsReportQuerySchema>;
export type AdjustmentsReportQuery = z.infer<typeof adjustmentsReportQuerySchema>;
export type ConsumptionReportQuery = z.infer<typeof consumptionReportQuerySchema>;
