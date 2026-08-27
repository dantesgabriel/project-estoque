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
    // Entrada com lote: cria um novo lote com essa quantidade e vincula a movimentação a ele.
    newBatch?: { batchNumber?: string; expirationDate: Date };
    // Saída de um lote específico: decrementa esse lote e vincula a movimentação a ele.
    consumeBatchId?: string;
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

      let batchId: string | undefined;

      if (params.type === "IN" && params.newBatch) {
        const batch = await tx.batch.create({
          data: {
            productId: params.productId,
            batchNumber: params.newBatch.batchNumber,
            expirationDate: params.newBatch.expirationDate,
            quantity: params.quantity,
            supplier: params.supplier,
          },
        });
        batchId = batch.id;
      }

      if (params.type === "OUT" && params.consumeBatchId) {
        const batch = await tx.batch.findUnique({ where: { id: params.consumeBatchId } });

        if (!batch || batch.productId !== params.productId) {
          throw new Error("BATCH_NOT_FOUND");
        }

        if (batch.quantity < params.quantity) {
          throw new Error("BATCH_INSUFFICIENT_QUANTITY");
        }

        await tx.batch.update({
          where: { id: params.consumeBatchId },
          data: { quantity: { decrement: params.quantity } },
        });
        batchId = params.consumeBatchId;
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
          batchId,
        },
        include: { product: true, batch: true },
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
            batchId,
          },
        },
      });

      return { ...movement, product: { ...movement.product, currentStock: newStock } };
    });
  },

  // Lote com validade mais próxima e saldo suficiente para cobrir a saída — usado
  // como sugestão automática (FEFO) quando o usuário não escolhe um lote manualmente.
  findFefoBatch(productId: string, quantity: number) {
    return prisma.batch.findFirst({
      where: { productId, quantity: { gte: quantity } },
      orderBy: { expirationDate: "asc" },
    });
  },
};
