"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchesRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.batchesRepository = {
    // Lotes ativos (com saldo) de um produto, ordenados por validade — o mais próximo
    // de vencer primeiro, que é a ordem natural para consumo FEFO e para exibição.
    listByProduct(productId) {
        return prisma_1.prisma.batch.findMany({
            where: { productId, quantity: { gt: 0 } },
            orderBy: { expirationDate: "asc" },
        });
    },
    create(data) {
        return prisma_1.prisma.batch.create({ data });
    },
    decrementQuantity(id, amount) {
        return prisma_1.prisma.batch.update({
            where: { id },
            data: { quantity: { decrement: amount } },
        });
    },
    // Lotes vencidos com saldo — usado no dashboard e em alertas.
    countExpired() {
        return prisma_1.prisma.batch.count({
            where: { quantity: { gt: 0 }, expirationDate: { lt: new Date() } },
        });
    },
    // Lotes que vencem dentro de N dias (mas ainda não venceram) — "próximo do vencimento".
    countExpiringSoon(days) {
        const now = new Date();
        const limit = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        return prisma_1.prisma.batch.count({
            where: { quantity: { gt: 0 }, expirationDate: { gte: now, lte: limit } },
        });
    },
};
//# sourceMappingURL=batches.repository.js.map