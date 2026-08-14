import { MovementType, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ListMovementsQuery } from "./stock-movements.schema";

export const stockMovementsRepository = {
  list(filters: ListMovementsQuery) {
    const where: Prisma.StockMovementWhereInput = {
      ...(filters.productId && { productId: filters.productId }),
      ...(filters.type && { type: filters.type }),
    };

    return prisma.stockMovement.findMany({
      where,
      include: { product: true, user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  // Cria a movimentação, ajusta o currentStock do produto e grava o audit log
  // em uma única transação — se qualquer passo falhar, nada é aplicado.
  // Isso é o que garante a regra "estoque não deve ser alterado silenciosamente".
  async createWithStockUpdate(params: {
    productId: string;
    type: MovementType;
    quantity: number;
    reason: string;
    supplier?: string;
    invoiceNumber?: string;
    note?: string;
    userId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: params.productId } });

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const delta = params.type === "IN" ? params.quantity : -params.quantity;
      const newStock = product.currentStock + delta;

      if (newStock < 0) {
        throw new Error("NEGATIVE_STOCK");
      }

      const movement = await tx.stockMovement.create({
        data: {
          productId: params.productId,
          type: params.type,
          quantity: params.quantity,
          reason: params.reason as never,
          supplier: params.supplier,
          invoiceNumber: params.invoiceNumber,
          note: params.note,
          userId: params.userId,
        },
        include: { product: true },
      });

      await tx.product.update({
        where: { id: params.productId },
        data: { currentStock: newStock },
      });

      await tx.auditLog.create({
        data: {
          entityType: "StockMovement",
          entityId: movement.id,
          action: params.type === "IN" ? "STOCK_IN" : "STOCK_OUT",
          userId: params.userId,
          changes: {
            productId: params.productId,
            previousStock: product.currentStock,
            newStock,
            quantity: params.quantity,
            reason: params.reason,
          },
        },
      });

      return { ...movement, product: { ...movement.product, currentStock: newStock } };
    });
  },
};
