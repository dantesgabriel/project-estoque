import { dashboardRepository } from "./dashboard.repository";

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
    quantity: m.quantity,
    userName: m.user.name,
    date: m.createdAt,
  }));

  const adjustmentEvents = adjustments.map((a) => ({
    type: "AJUSTE" as const,
    productName: a.product.name,
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
      lowStockResult,
      zeroStockCount,
      pendingDivergences,
      inProgressInventory,
      recentMovements,
      recentAdjustments,
    ] = await Promise.all([
      dashboardRepository.countActiveProducts(),
      dashboardRepository.countLowStock(),
      dashboardRepository.countZeroStock(),
      dashboardRepository.countPendingDivergences(),
      dashboardRepository.findInProgressInventory(),
      dashboardRepository.recentMovements(10),
      dashboardRepository.recentAdjustments(10),
    ]);

    return {
      totalProducts,
      lowStockCount: Number(lowStockResult[0]?.count ?? 0),
      zeroStockCount,
      pendingDivergences,
      inventoryInProgress: inProgressInventory,
      recentActivity: mergeRecentActivity(recentMovements, recentAdjustments, 10),
    };
  },
};
