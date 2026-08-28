"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
exports.productsRepository = {
    findById(id) {
        return prisma_1.prisma.product.findUnique({ where: { id }, include: { category: true } });
    },
    findBySku(sku) {
        return prisma_1.prisma.product.findUnique({ where: { sku } });
    },
    findByBarcode(barcode) {
        return prisma_1.prisma.product.findUnique({ where: { barcode } });
    },
    // lowStock (currentStock <= minStock) compara duas colunas — Prisma não suporta isso
    // direto no "where", então usamos $queryRaw só para esse filtro específico.
    async list(filters) {
        if (filters.lowStock) {
            return prisma_1.prisma.$queryRaw `
        SELECT p.*, row_to_json(c.*) as category
        FROM products p
        JOIN categories c ON c.id = p."categoryId"
        WHERE p."currentStock" <= p."minStock"
          ${filters.categoryId ? client_1.Prisma.sql `AND p."categoryId" = ${filters.categoryId}` : client_1.Prisma.empty}
          ${filters.active !== undefined ? client_1.Prisma.sql `AND p.active = ${filters.active}` : client_1.Prisma.empty}
          ${filters.name ? client_1.Prisma.sql `AND p.name ILIKE ${"%" + filters.name + "%"}` : client_1.Prisma.empty}
        ORDER BY p.name ASC
      `;
        }
        const where = {
            ...(filters.name && { name: { contains: filters.name, mode: "insensitive" } }),
            ...(filters.categoryId && { categoryId: filters.categoryId }),
            ...(filters.active !== undefined && { active: filters.active }),
            ...(filters.zeroStock && { currentStock: 0 }),
        };
        return prisma_1.prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { name: "asc" },
        });
    },
    create(data) {
        return prisma_1.prisma.product.create({
            data: {
                name: data.name,
                sku: data.sku,
                barcode: data.barcode,
                categoryId: data.categoryId,
                unit: data.unit,
                minStock: data.minStock,
                maxStock: data.maxStock,
                location: data.location,
                tracksBatch: data.tracksBatch,
            },
            include: { category: true },
        });
    },
    update(id, data) {
        return prisma_1.prisma.product.update({ where: { id }, data, include: { category: true } });
    },
};
//# sourceMappingURL=products.repository.js.map