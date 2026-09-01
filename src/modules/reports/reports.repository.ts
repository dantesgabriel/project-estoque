import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const reportsRepository = {
  movements(where: Prisma.StockMovementWhereInput) {
    return prisma.stockMovement.findMany({
      where,
      select: { id: true, createdAt: true, type: true, reason: true, quantity: true, supplier: true,
        product: { select: { id: true, name: true, sku: true, unit: true, category: { select: { id: true, name: true } } } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
  adjustments(where: Prisma.StockAdjustmentWhereInput) {
    return prisma.stockAdjustment.findMany({
      where,
      select: { id: true, createdAt: true, previousQty: true, newQty: true, difference: true, reason: true, note: true,
        product: { select: { id: true, name: true, sku: true } },
        user: { select: { id: true, name: true } }, approvedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
  consumption(where: Prisma.AppointmentItemWhereInput) {
    return prisma.appointmentItem.findMany({
      where,
      select: { id: true, quantity: true, productId: true, productName: true, productSku: true, unit: true,
        appointment: { select: { id: true, attendedAt: true, tutor: { select: { id: true, name: true } }, pet: { select: { id: true, name: true } } } },
      },
    });
  },
};
