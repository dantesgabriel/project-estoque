import { prisma } from "../../config/prisma";

export const adjustmentsRepository = {
  list() {
    return prisma.stockAdjustment.findMany({
      include: {
        product: { select: { id: true, name: true, sku: true } },
        user: { select: { id: true, name: true } },
        approvedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findInventoryItem(id: string) {
    return prisma.inventoryItem.findUnique({
      where: { id },
      include: { product: true, adjustment: true },
    });
  },

  // Cria o ajuste, aplica no currentStock do produto e grava auditoria — em transação única,
  // seguindo a mesma regra de "nunca alterar estoque silenciosamente" usada em stock-movements.
  async createAndApply(params: {
    productId: string;
    inventoryItemId?: string;
    previousQty: number;
    newQty: number;
    reason: string;
    note?: string;
    userId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const adjustment = await tx.stockAdjustment.create({
        data: {
          productId: params.productId,
          inventoryItemId: params.inventoryItemId,
          previousQty: params.previousQty,
          newQty: params.newQty,
          difference: params.newQty - params.previousQty,
          reason: params.reason as never,
          note: params.note,
          userId: params.userId,
          approvedById: params.userId, // criação já é feita por ADMIN — aprovação implícita no MVP
        },
        include: { product: true },
      });

      await tx.product.update({
        where: { id: params.productId },
        data: { currentStock: params.newQty },
      });

      await tx.auditLog.create({
        data: {
          entityType: "StockAdjustment",
          entityId: adjustment.id,
          action: "ADJUSTMENT",
          userId: params.userId,
          changes: {
            productId: params.productId,
            previousQty: params.previousQty,
            newQty: params.newQty,
            reason: params.reason,
          },
        },
      });

      return { ...adjustment, product: { ...adjustment.product, currentStock: params.newQty } };
    });
  },
};
