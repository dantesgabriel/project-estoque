import { prisma } from "../../config/prisma";

export const dashboardRepository = {
  countActiveProducts() {
    return prisma.product.count({ where: { active: true } });
  },

  // currentStock <= minStock, mas > 0 (zerados são contados separadamente).
  countLowStock() {
    return prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM products
      WHERE active = true AND "currentStock" > 0 AND "currentStock" <= "minStock"
    `;
  },

  countZeroStock() {
    return prisma.product.count({ where: { active: true, currentStock: 0 } });
  },

  // Divergências ainda não resolvidas: itens contados com divergence != 0 e sem ajuste vinculado.
  countPendingDivergences() {
    return prisma.inventoryItem.count({
      where: {
        divergence: { not: 0 },
        adjustment: null,
      },
    });
  },

  findInProgressInventory() {
    return prisma.inventory.findFirst({
      where: { status: "IN_PROGRESS" },
      select: { id: true, name: true, createdAt: true },
    });
  },

  recentMovements(limit: number) {
    return prisma.stockMovement.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { name: true, sku: true, category: { select: { name: true } } } },
        user: { select: { name: true } },
      },
    });
  },

  recentAdjustments(limit: number) {
    return prisma.stockAdjustment.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { name: true, sku: true, category: { select: { name: true } } } },
        user: { select: { name: true } },
      },
    });
  },
};
