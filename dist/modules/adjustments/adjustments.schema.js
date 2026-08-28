"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManualAdjustmentSchema = exports.createAdjustmentFromInventorySchema = void 0;
const zod_1 = require("zod");
const adjustmentReasons = [
    "PERDA",
    "VENCIMENTO",
    "USO_NAO_REGISTRADO",
    "ERRO_CADASTRO",
    "DESCARTE",
    "OUTRO",
];
// Ajuste vindo de uma divergência de inventário.
exports.createAdjustmentFromInventorySchema = zod_1.z.object({
    inventoryItemId: zod_1.z.string().uuid(),
    reason: zod_1.z.enum(adjustmentReasons),
    note: zod_1.z.string().optional(),
});
// Ajuste manual, sem vínculo com inventário (ex: correção pontual de cadastro).
exports.createManualAdjustmentSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    newQty: zod_1.z.number().int().min(0, "Quantidade não pode ser negativa"),
    reason: zod_1.z.enum(adjustmentReasons),
    note: zod_1.z.string().optional(),
});
//# sourceMappingURL=adjustments.schema.js.map