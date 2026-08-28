"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Nome muito curto"),
    sku: zod_1.z.string().min(1, "SKU obrigatório"),
    barcode: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().uuid("Categoria inválida"),
    unit: zod_1.z.string().min(1, "Unidade de medida obrigatória"),
    minStock: zod_1.z.number().int().min(0).default(0),
    maxStock: zod_1.z.number().int().min(0).optional(),
    location: zod_1.z.string().optional(),
    tracksBatch: zod_1.z.boolean().default(false),
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    sku: zod_1.z.string().min(1).optional(),
    barcode: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    unit: zod_1.z.string().min(1).optional(),
    minStock: zod_1.z.number().int().min(0).optional(),
    maxStock: zod_1.z.number().int().min(0).optional(),
    location: zod_1.z.string().optional(),
    active: zod_1.z.boolean().optional(),
    tracksBatch: zod_1.z.boolean().optional(),
});
// Filtros da listagem (seção 7.3 do projeto): nome, categoria, estoque baixo, zerados, ativos/inativos.
exports.listProductsQuerySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    lowStock: zod_1.z.coerce.boolean().optional(),
    zeroStock: zod_1.z.coerce.boolean().optional(),
    active: zod_1.z.coerce.boolean().optional(),
});
//# sourceMappingURL=products.schema.js.map