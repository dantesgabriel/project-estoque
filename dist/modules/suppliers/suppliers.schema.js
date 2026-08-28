"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSupplierSchema = exports.createSupplierSchema = void 0;
const zod_1 = require("zod");
const optionalText = zod_1.z.string().trim().min(1).optional();
exports.createSupplierSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, "Nome muito curto"),
    document: optionalText,
    contactName: optionalText,
    email: zod_1.z.string().email("Email inválido").optional(),
    phone: optionalText,
});
exports.updateSupplierSchema = exports.createSupplierSchema.partial().extend({
    active: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=suppliers.schema.js.map