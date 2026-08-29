import { z } from "zod";

export const createAppointmentSchema = z.object({
  tutorId: z.string().uuid("Tutor inválido"),
  petId: z.string().uuid("Pet inválido"),
  responsibleId: z.string().uuid("Responsável inválido"),
  attendedAt: z.coerce.date().optional(),
  reason: z.string().trim().min(3, "Informe o motivo do atendimento"),
  notes: z.string().trim().optional(),
  items: z.array(z.object({
    productId: z.string().uuid("Produto inválido"),
    quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
    batchId: z.string().uuid("Lote inválido").optional(),
  })).refine((items) => new Set(items.map((item) => item.productId)).size === items.length, {
    message: "Um produto só pode ser informado uma vez no atendimento",
  }),
});

export const cancelAppointmentSchema = z.object({
  reason: z.string().trim().min(3, "Informe o motivo do cancelamento"),
});

export const appointmentListQuerySchema = z.object({
  tutorId: z.string().uuid().optional(),
  petId: z.string().uuid().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
