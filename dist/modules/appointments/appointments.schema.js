"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentListQuerySchema = exports.cancelAppointmentSchema = exports.createAppointmentSchema = void 0;
const zod_1 = require("zod");
exports.createAppointmentSchema = zod_1.z.object({
    tutorId: zod_1.z.string().uuid("Tutor inválido"),
    petId: zod_1.z.string().uuid("Pet inválido"),
    responsibleId: zod_1.z.string().uuid("Responsável inválido"),
    attendedAt: zod_1.z.coerce.date().optional(),
    reason: zod_1.z.string().trim().min(3, "Informe o motivo do atendimento"),
    notes: zod_1.z.string().trim().optional(),
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().uuid("Produto inválido"),
        quantity: zod_1.z.number().int().positive("Quantidade deve ser maior que zero"),
        batchId: zod_1.z.string().uuid("Lote inválido").optional(),
    })).refine((items) => new Set(items.map((item) => item.productId)).size === items.length, {
        message: "Um produto só pode ser informado uma vez no atendimento",
    }),
});
exports.cancelAppointmentSchema = zod_1.z.object({
    reason: zod_1.z.string().trim().min(3, "Informe o motivo do cancelamento"),
});
exports.appointmentListQuerySchema = zod_1.z.object({
    tutorId: zod_1.z.string().uuid().optional(),
    petId: zod_1.z.string().uuid().optional(),
    from: zod_1.z.coerce.date().optional(),
    to: zod_1.z.coerce.date().optional(),
});
//# sourceMappingURL=appointments.schema.js.map