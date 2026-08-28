"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.inventoryRepository = {
    findInProgress() {
        return prisma_1.prisma.inventory.findFirst({ where: { status: "IN_PROGRESS" } });
    },
    list() {
        return prisma_1.prisma.inventory.findMany({
            include: { responsible: { select: { id: true, name: true } } },
            orderBy: { createdAt: "desc" },
        });
    },
    findById(id) {
        return prisma_1.prisma.inventory.findUnique({
            where: { id },
            include: {
                responsible: { select: { id: true, name: true } },
                items: {
                    include: { product: { select: { id: true, name: true, sku: true, unit: true } } },
                    orderBy: { product: { name: "asc" } },
                },
            },
        });
    },
    findItemById(inventoryId, itemId) {
        return prisma_1.prisma.inventoryItem.findFirst({
            where: { id: itemId, inventoryId },
            include: { product: true },
        });
    },
    // Cria o inventário e já gera um InventoryItem por produto, com o snapshot
    // do estoque atual (expectedQty) no momento da abertura — é o "marco" da contagem.
    async createWithItems(params) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const products = await tx.product.findMany({
                where: {
                    active: true,
                    ...(params.productIds && { id: { in: params.productIds } }),
                },
                select: { id: true, currentStock: true },
            });
            if (products.length === 0) {
                throw new Error("NO_PRODUCTS_TO_COUNT");
            }
            const inventory = await tx.inventory.create({
                data: {
                    name: params.name,
                    blindMode: params.blindMode,
                    responsibleId: params.responsibleId,
                    status: "IN_PROGRESS",
                    items: {
                        createMany: {
                            data: products.map((p) => ({
                                productId: p.id,
                                expectedQty: p.currentStock,
                            })),
                        },
                    },
                },
                include: { items: true },
            });
            await tx.auditLog.create({
                data: {
                    entityType: "Inventory",
                    entityId: inventory.id,
                    action: "INVENTORY_OPEN",
                    userId: params.responsibleId,
                    changes: { itemCount: products.length, blindMode: params.blindMode },
                },
            });
            return inventory;
        });
    },
    updateItemCount(itemId, countedQty, note, divergence) {
        return prisma_1.prisma.inventoryItem.update({
            where: { id: itemId },
            data: { countedQty, note, divergence, countedAt: new Date() },
        });
    },
    async closeInventory(id, userId) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const inventory = await tx.inventory.update({
                where: { id },
                data: { status: "COMPLETED", closedAt: new Date() },
                include: { items: true },
            });
            await tx.auditLog.create({
                data: {
                    entityType: "Inventory",
                    entityId: inventory.id,
                    action: "INVENTORY_CLOSE",
                    userId,
                    changes: {
                        divergentItems: inventory.items.filter((i) => (i.divergence ?? 0) !== 0).length,
                    },
                },
            });
            return inventory;
        });
    },
};
//# sourceMappingURL=inventory.repository.js.map