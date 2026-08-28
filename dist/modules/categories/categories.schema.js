"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Nome muito curto"),
});
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Nome muito curto"),
});
//# sourceMappingURL=categories.schema.js.map