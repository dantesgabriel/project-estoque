"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.categoriesRepository = {
    list() {
        return prisma_1.prisma.category.findMany({ orderBy: { name: "asc" } });
    },
    findById(id) {
        return prisma_1.prisma.category.findUnique({ where: { id } });
    },
    findByName(name) {
        return prisma_1.prisma.category.findUnique({ where: { name } });
    },
    create(data) {
        return prisma_1.prisma.category.create({ data });
    },
    update(id, data) {
        return prisma_1.prisma.category.update({ where: { id }, data });
    },
    // Conta produtos vinculados — usado para impedir exclusão de categoria em uso.
    countProducts(id) {
        return prisma_1.prisma.product.count({ where: { categoryId: id } });
    },
    delete(id) {
        return prisma_1.prisma.category.delete({ where: { id } });
    },
};
//# sourceMappingURL=categories.repository.js.map