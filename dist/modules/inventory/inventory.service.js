"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryService = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const inventory_repository_1 = require("./inventory.repository");
exports.inventoryService = {
    list() {
        return inventory_repository_1.inventoryRepository.list();
    },
    async getById(id) {
        const inventory = await inventory_repository_1.inventoryRepository.findById(id);
        if (!inventory) {
            throw new AppError_1.AppError("Inventário não encontrado", 404);
        }
        return inventory;
    },
    // Retorna o inventário formatado de acordo com o modo cego: se blindMode,
    // remove expectedQty da resposta pra não influenciar quem está contando.
    async getForCounting(id) {
        const inventory = await this.getById(id);
        if (!inventory.blindMode) {
            return inventory;
        }
        return {
            ...inventory,
            items: inventory.items.map((item) => {
                const { expectedQty: _expectedQty, ...rest } = item;
                return rest;
            }),
        };
    },
    async create(input, responsibleId) {
        // Regra decidida: apenas 1 inventário em andamento por vez.
        const inProgress = await inventory_repository_1.inventoryRepository.findInProgress();
        if (inProgress) {
            throw new AppError_1.AppError(`Já existe um inventário em andamento ("${inProgress.name}"). Finalize-o antes de abrir outro.`, 409);
        }
        try {
            return await inventory_repository_1.inventoryRepository.createWithItems({
                name: input.name,
                blindMode: input.blindMode,
                responsibleId,
                productIds: input.productIds,
            });
        }
        catch (err) {
            if (err instanceof Error && err.message === "NO_PRODUCTS_TO_COUNT") {
                throw new AppError_1.AppError("Nenhum produto ativo encontrado para contagem", 400);
            }
            throw err;
        }
    },
    async submitCount(inventoryId, itemId, input) {
        const inventory = await this.getById(inventoryId);
        if (inventory.status !== "IN_PROGRESS") {
            throw new AppError_1.AppError("Este inventário já foi finalizado", 400);
        }
        const item = await inventory_repository_1.inventoryRepository.findItemById(inventoryId, itemId);
        if (!item) {
            throw new AppError_1.AppError("Item de inventário não encontrado", 404);
        }
        const divergence = input.countedQty - item.expectedQty;
        return inventory_repository_1.inventoryRepository.updateItemCount(itemId, input.countedQty, input.note, divergence);
    },
    async close(id, userId) {
        const inventory = await this.getById(id);
        if (inventory.status !== "IN_PROGRESS") {
            throw new AppError_1.AppError("Este inventário já foi finalizado", 400);
        }
        const uncounted = inventory.items.filter((item) => item.countedQty === null);
        if (uncounted.length > 0) {
            throw new AppError_1.AppError(`Ainda existem ${uncounted.length} produto(s) sem contagem registrada`, 400);
        }
        return inventory_repository_1.inventoryRepository.closeInventory(id, userId);
    },
};
//# sourceMappingURL=inventory.service.js.map