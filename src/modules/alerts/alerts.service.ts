import { batchesRepository } from "../batches/batches.repository";
import { dashboardRepository } from "../dashboard/dashboard.repository";

const EXPIRING_SOON_DAYS = 30;

export const alertsService = {
  async getCurrentAlerts() {
    const [lowStockResult, zeroStockCount, pendingDivergences, expiredBatchesCount, expiringSoonBatchesCount] = await Promise.all([
      dashboardRepository.countLowStock(),
      dashboardRepository.countZeroStock(),
      dashboardRepository.countPendingDivergences(),
      batchesRepository.countExpired(),
      batchesRepository.countExpiringSoon(EXPIRING_SOON_DAYS),
    ]);
    const lowStockCount = Number(lowStockResult[0]?.count ?? 0);
    const counts = { lowStockCount, zeroStockCount, pendingDivergences, expiredBatchesCount, expiringSoonBatchesCount };
    const items = [
      { type: "LOW_STOCK", severity: "warning", count: lowStockCount },
      { type: "ZERO_STOCK", severity: "critical", count: zeroStockCount },
      { type: "PENDING_DIVERGENCE", severity: "warning", count: pendingDivergences },
      { type: "EXPIRED_BATCH", severity: "critical", count: expiredBatchesCount },
      { type: "EXPIRING_BATCH", severity: "warning", count: expiringSoonBatchesCount },
    ].filter((item) => item.count > 0);
    return { ...counts, total: items.reduce((sum, item) => sum + item.count, 0), items };
  },
};
