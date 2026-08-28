"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustmentsService = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const products_repository_1 = require("../products/products.repository");
const adjustments_repository_1 = require("./adjustments.repository");
exports.adjustmentsService = {
    list() {
        return adjustments_repository_1.adjustmentsRepository.list();
    },
    async createFromInventory(input, userId) {
        const item = await adjustments_repository_1.adjustmentsRepository.findInventoryItem(input.inventoryItemId);
        if (!item) {
            throw new AppError_1.AppError("Item de inventário não encontrado", 404);
        }
        if (item.countedQty === null) {
            throw new AppError_1.AppError("Este item ainda não foi contado", 400);
        }
        if (item.adjustment) {
            throw new AppError_1.AppError("Este item já possui um ajuste registrado", 409);
        }
        if (item.divergence === 0) {
            throw new AppError_1.AppError("Este item não apresenta divergência, ajuste desnecessário", 400);
        }
        return adjustments_repository_1.adjustmentsRepository.createAndApply({
            productId: item.productId,
            inventoryItemId: item.id,
            previousQty: item.expectedQty,
            newQty: item.countedQty,
            reason: input.reason,
            note: input.note,
            userId,
        });
    },
    async createManual(input, userId) {
        const product = await products_repository_1.productsRepository.findById(input.productId);
        if (!product) {
            throw new AppError_1.AppError("Produto não encontrado", 404);
        }
        if (product.currentStock === input.newQty) {
            throw new AppError_1.AppError("A nova quantidade é igual ao estoque atual, ajuste desnecessário", 400);
        }
        return adjustments_repository_1.adjustmentsRepository.createAndApply({
            productId: input.productId,
            previousQty: product.currentStock,
            newQty: input.newQty,
            reason: input.reason,
            note: input.note,
            userId,
        });
    },
};
//# sourceMappingURL=adjustments.service.js.map