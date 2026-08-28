"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suppliersRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.suppliersRepository = {
    list() {
        return prisma_1.prisma.supplier.findMany({ orderBy: { name: "asc" } });
    },
    findById(id) {
        return prisma_1.prisma.supplier.findUnique({ where: { id } });
    },
    findByName(name) {
        return prisma_1.prisma.supplier.findUnique({ where: { name } });
    },
    findByDocument(document) {
        return prisma_1.prisma.supplier.findUnique({ where: { document } });
    },
    create(data) {
        return prisma_1.prisma.supplier.create({ data });
    },
    update(id, data) {
        return prisma_1.prisma.supplier.update({ where: { id }, data });
    },
    countMovements(id) {
        return prisma_1.prisma.stockMovement.count({ where: { supplierId: id } });
    },
    delete(id) {
        return prisma_1.prisma.supplier.delete({ where: { id } });
    },
};
//# sourceMappingURL=suppliers.repository.js.map