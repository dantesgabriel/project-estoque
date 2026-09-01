import { Prisma } from "@prisma/client";
import { AppError } from "../../shared/errors/AppError";
import { reportsRepository } from "./reports.repository";
import { AdjustmentsReportQuery, ConsumptionReportQuery, MovementsReportQuery } from "./reports.schema";

function resolvePeriod(from?: string, to?: string) {
  const today = new Date();
  const defaultFrom = new Date(today); defaultFrom.setDate(today.getDate() - 29);
  const start = new Date(`${from ?? defaultFrom.toISOString().slice(0, 10)}T00:00:00`);
  const end = new Date(`${to ?? today.toISOString().slice(0, 10)}T23:59:59.999`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) throw new AppError("Período inválido", 400);
  if (end.getTime() - start.getTime() > 366 * 24 * 60 * 60 * 1000) throw new AppError("O período máximo para relatórios é de 12 meses", 400);
  return { gte: start, lte: end };
}

export const reportsService = {
  async movements(query: MovementsReportQuery) {
    const createdAt = resolvePeriod(query.from, query.to);
    const rows = await reportsRepository.movements({ createdAt, ...(query.productId && { productId: query.productId }), ...(query.type && { type: query.type }), ...(query.reason && { reason: query.reason }), ...(query.categoryId && { product: { categoryId: query.categoryId } }) });
    const totalIn = rows.filter((row) => row.type === "IN").reduce((sum, row) => sum + row.quantity, 0);
    const totalOut = rows.filter((row) => row.type === "OUT").reduce((sum, row) => sum + row.quantity, 0);
    const daily = new Map<string, { date: string; totalIn: number; totalOut: number }>();
    for (const row of rows) { const date = row.createdAt.toISOString().slice(0, 10); const current = daily.get(date) ?? { date, totalIn: 0, totalOut: 0 }; if (row.type === "IN") current.totalIn += row.quantity; else current.totalOut += row.quantity; daily.set(date, current); }
    return { summary: { movementsCount: rows.length, totalIn, totalOut, periodBalance: totalIn - totalOut }, timeline: [...daily.values()].sort((a, b) => a.date.localeCompare(b.date)), items: rows.map((row) => ({ ...row, category: row.product.category })) };
  },
  async adjustments(query: AdjustmentsReportQuery) {
    const rows = await reportsRepository.adjustments({ createdAt: resolvePeriod(query.from, query.to), ...(query.productId && { productId: query.productId }), ...(query.reason && { reason: query.reason }) });
    const totalIncrease = rows.filter((row) => row.difference > 0).reduce((sum, row) => sum + row.difference, 0);
    const totalDecrease = rows.filter((row) => row.difference < 0).reduce((sum, row) => sum + Math.abs(row.difference), 0);
    return { summary: { adjustmentsCount: rows.length, totalIncrease, totalDecrease, netDifference: totalIncrease - totalDecrease }, items: rows };
  },
  async consumption(query: ConsumptionReportQuery) {
    const attendedAt = resolvePeriod(query.from, query.to);
    const rows = await reportsRepository.consumption({ appointment: { status: "COMPLETED", attendedAt, ...(query.tutorId && { tutorId: query.tutorId }), ...(query.petId && { petId: query.petId }) }, ...(query.productId && { productId: query.productId }) });
    const grouped = new Map<string, { key: string; label: string; details?: string; appointments: Set<string>; products: Map<string, { productName: string; sku: string; quantity: number; unit: string }> }>();
    for (const row of rows) {
      const key = query.groupBy === "product" ? row.productId : query.groupBy === "tutor" ? row.appointment.tutor.id : row.appointment.pet.id;
      const label = query.groupBy === "product" ? row.productName : query.groupBy === "tutor" ? row.appointment.tutor.name : row.appointment.pet.name;
      const details = query.groupBy === "pet" ? row.appointment.tutor.name : undefined;
      const group = grouped.get(key) ?? { key, label, details, appointments: new Set<string>(), products: new Map() };
      group.appointments.add(row.appointment.id);
      const product = group.products.get(row.productId) ?? { productName: row.productName, sku: row.productSku, quantity: 0, unit: row.unit };
      product.quantity += row.quantity; group.products.set(row.productId, product); grouped.set(key, group);
    }
    const groups = [...grouped.values()].map((group) => ({ key: group.key, label: group.label, details: group.details, appointmentsCount: group.appointments.size, products: [...group.products.values()].sort((a, b) => b.quantity - a.quantity) })).sort((a, b) => b.appointmentsCount - a.appointmentsCount);
    return { summary: { appointmentsCount: new Set(rows.map((row) => row.appointment.id)).size, consumedItemLines: rows.length }, groups };
  },
};
