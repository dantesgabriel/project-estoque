import { prisma } from "../../config/prisma";

export const batchesRepository = {
  // Lotes ativos (com saldo) de um produto, ordenados por validade — o mais próximo
  // de vencer primeiro, que é a ordem natural para consumo FEFO e para exibição.
  listByProduct(productId: string) {
    return prisma.batch.findMany({
      where: { productId, quantity: { gt: 0 } },
      orderBy: { expirationDate: "asc" },
    });
  },

  create(data: {
    productId: string;
    batchNumber?: string;
    expirationDate: Date;
    quantity: number;
    supplier?: string;
  }) {
    return prisma.batch.create({ data });
  },

  decrementQuantity(id: string, amount: number) {
    return prisma.batch.update({
      where: { id },
      data: { quantity: { decrement: amount } },
    });
  },

  // Lotes vencidos com saldo — usado no dashboard e em alertas.
  countExpired() {
    return prisma.batch.count({
      where: { quantity: { gt: 0 }, expirationDate: { lt: new Date() } },
    });
  },

  // Lotes que vencem dentro de N dias (mas ainda não venceram) — "próximo do vencimento".
  countExpiringSoon(days: number) {
    const now = new Date();
    const limit = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return prisma.batch.count({
      where: { quantity: { gt: 0 }, expirationDate: { gte: now, lte: limit } },
    });
  },
};
