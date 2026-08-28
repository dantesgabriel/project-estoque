"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const dashboard_repository_1 = require("./dashboard.repository");
const batches_repository_1 = require("../batches/batches.repository");
const EXPIRING_SOON_DAYS = 30;
// Une entradas/saídas e ajustes numa única linha do tempo, ordenada por data,
// para alimentar a seção "Últimas movimentações" do dashboard (seção 18).
function mergeRecentActivity(movements, adjustments, limit) {
    const movementEvents = movements.map((m) => ({
        type: m.type === "IN" ? "ENTRADA" : "SAIDA",
        productName: m.product.name,
        quantity: m.quantity,
        userName: m.user.name,
        date: m.createdAt,
    }));
    const adjustmentEvents = adjustments.map((a) => ({
        type: "AJUSTE",
        productName: a.product.name,
        quantity: a.difference,
        userName: a.user.name,
        date: a.createdAt,
    }));
    return [...movementEvents, ...adjustmentEvents]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, limit);
}
exports.dashboardService = {
    async getSummary() {
        const [totalProducts, lowStockResult, zeroStockCount, pendingDivergences, inProgressInventory, recentMovements, recentAdjustments, expiredBatches, expiringSoonBatches,] = await Promise.all([
            dashboard_repository_1.dashboardRepository.countActiveProducts(),
            dashboard_repository_1.dashboardRepository.countLowStock(),
            dashboard_repository_1.dashboardRepository.countZeroStock(),
            dashboard_repository_1.dashboardRepository.countPendingDivergences(),
            dashboard_repository_1.dashboardRepository.findInProgressInventory(),
            dashboard_repository_1.dashboardRepository.recentMovements(10),
            dashboard_repository_1.dashboardRepository.recentAdjustments(10),
            batches_repository_1.batchesRepository.countExpired(),
            batches_repository_1.batchesRepository.countExpiringSoon(EXPIRING_SOON_DAYS),
        ]);
        return {
            totalProducts,
            lowStockCount: Number(lowStockResult[0]?.count ?? 0),
            zeroStockCount,
            pendingDivergences,
            expiredBatchesCount: expiredBatches,
            expiringSoonBatchesCount: expiringSoonBatches,
            inventoryInProgress: inProgressInventory,
            recentActivity: mergeRecentActivity(recentMovements, recentAdjustments, 10),
        };
    },
};
//# sourceMappingURL=dashboard.service.js.map