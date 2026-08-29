"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.dashboardRepository = {
    countActiveProducts() {
        return prisma_1.prisma.product.count({ where: { active: true } });
    },
    // currentStock <= minStock, mas > 0 (zerados são contados separadamente).
    countLowStock() {
        return prisma_1.prisma.$queryRaw `
      SELECT COUNT(*) as count
      FROM products
      WHERE active = true AND "currentStock" > 0 AND "currentStock" <= "minStock"
    `;
    },
    countZeroStock() {
        return prisma_1.prisma.product.count({ where: { active: true, currentStock: 0 } });
    },
    // Divergências ainda não resolvidas: itens contados com divergence != 0 e sem ajuste vinculado.
    countPendingDivergences() {
        return prisma_1.prisma.inventoryItem.count({
            where: {
                divergence: { not: 0 },
                adjustment: null,
            },
        });
    },
    findInProgressInventory() {
        return prisma_1.prisma.inventory.findFirst({
            where: { status: "IN_PROGRESS" },
            select: { id: true, name: true, createdAt: true },
        });
    },
    recentMovements(limit) {
        return prisma_1.prisma.stockMovement.findMany({
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                product: { select: { name: true, sku: true, category: { select: { name: true } } } },
                user: { select: { name: true } },
            },
        });
    },
    recentAdjustments(limit) {
        return prisma_1.prisma.stockAdjustment.findMany({
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                product: { select: { name: true, sku: true, category: { select: { name: true } } } },
                user: { select: { name: true } },
            },
        });
    },
};
//# sourceMappingURL=dashboard.repository.js.map