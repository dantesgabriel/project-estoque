import { dashboardRepository } from "./dashboard.repository";
import { alertsService } from "../alerts/alerts.service";

// Une entradas/saídas e ajustes numa única linha do tempo, ordenada por data,
// para alimentar a seção "Últimas movimentações" do dashboard (seção 18).
function mergeRecentActivity(
  movements: Awaited<ReturnType<typeof dashboardRepository.recentMovements>>,
  adjustments: Awaited<ReturnType<typeof dashboardRepository.recentAdjustments>>,
  limit: number
) {
  const movementEvents = movements.map((m) => ({
    type: m.type === "IN" ? ("ENTRADA" as const) : ("SAIDA" as const),
    productName: m.product.name,
    sku: m.product.sku,
    categoryName: m.product.category.name,
    quantity: m.quantity,
    userName: m.user.name,
    date: m.createdAt,
  }));

  const adjustmentEvents = adjustments.map((a) => ({
    type: "AJUSTE" as const,
    productName: a.product.name,
    sku: a.product.sku,
    categoryName: a.product.category.name,
    quantity: a.difference,
    userName: a.user.name,
    date: a.createdAt,
  }));

  return [...movementEvents, ...adjustmentEvents]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
}

export const dashboardService = {
  async getSummary() {
    const [
      totalProducts,
      alerts,
      inProgressInventory,
      recentMovements,
      recentAdjustments,
    ] = await Promise.all([
      dashboardRepository.countActiveProducts(),
      alertsService.getCurrentAlerts(),
      dashboardRepository.findInProgressInventory(),
      dashboardRepository.recentMovements(10),
      dashboardRepository.recentAdjustments(10),
    ]);

    return {
      totalProducts,
      lowStockCount: alerts.lowStockCount,
      zeroStockCount: alerts.zeroStockCount,
      pendingDivergences: alerts.pendingDivergences,
      expiredBatchesCount: alerts.expiredBatchesCount,
      expiringSoonBatchesCount: alerts.expiringSoonBatchesCount,
      inventoryInProgress: inProgressInventory,
      recentActivity: mergeRecentActivity(recentMovements, recentAdjustments, 10),
    };
  },
};
