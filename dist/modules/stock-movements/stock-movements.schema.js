"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMovementsQuerySchema = exports.createMovementSchema = void 0;
const zod_1 = require("zod");
const movementReasons = [
    "COMPRA",
    "USO_INTERNO",
    "ATENDIMENTO",
    "PERDA",
    "DESCARTE",
    "VENCIMENTO",
    "OUTRO",
];
exports.createMovementSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid("Produto inválido"),
    quantity: zod_1.z.number().int().positive("Quantidade deve ser maior que zero"),
    reason: zod_1.z.enum(movementReasons),
    supplier: zod_1.z.string().optional(),
    invoiceNumber: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    // Obrigatórios apenas para entradas de produtos com tracksBatch, dependendo
    // da quantidade e do papel do usuário — validado no service, não aqui.
    batchNumber: zod_1.z.string().optional(),
    expirationDate: zod_1.z.coerce.date().optional(),
    batchId: zod_1.z.string().uuid().optional(), // usado na saída, para indicar de qual lote tirar (opcional — se omitido, usa FEFO)
});
exports.listMovementsQuerySchema = zod_1.z.object({
    productId: zod_1.z.string().uuid().optional(),
    type: zod_1.z.enum(["IN", "OUT"]).optional(),
});
//# sourceMappingURL=stock-movements.schema.js.map