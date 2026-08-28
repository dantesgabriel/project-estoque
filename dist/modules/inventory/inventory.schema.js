"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countItemSchema = exports.createInventorySchema = void 0;
const zod_1 = require("zod");
exports.createInventorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Nome muito curto"),
    blindMode: zod_1.z.boolean().default(false),
    // Se omitido, o inventário inclui todos os produtos ativos (ex: inventário geral).
    productIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
exports.countItemSchema = zod_1.z.object({
    countedQty: zod_1.z.number().int().min(0, "Quantidade não pode ser negativa"),
    note: zod_1.z.string().optional(),
});
//# sourceMappingURL=inventory.schema.js.map