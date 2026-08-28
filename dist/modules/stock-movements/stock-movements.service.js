"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockMovementsService = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const products_repository_1 = require("../products/products.repository");
const stock_movements_repository_1 = require("./stock-movements.repository");
// Acima dessa quantidade, funcionário é obrigado a informar lote/validade em produtos
// com tracksBatch. Admin sempre pode pular essa exigência (bypass consciente).
const BATCH_REQUIRED_MIN_QTY = 10;
async function createEntry(input, userId, userRole) {
    const product = await products_repository_1.productsRepository.findById(input.productId);
    if (!product) {
        throw new AppError_1.AppError("Produto não encontrado", 404);
    }
    if (!product.active) {
        throw new AppError_1.AppError("Não é possível movimentar um produto inativo", 400);
    }
    if (product.tracksBatch) {
        const isAdmin = userRole === "ADMIN";
        const requiresBatchInfo = !isAdmin && input.quantity > BATCH_REQUIRED_MIN_QTY;
        if (requiresBatchInfo && !input.expirationDate) {
            throw new AppError_1.AppError(`Este produto controla lote — informe a data de validade para entradas acima de ${BATCH_REQUIRED_MIN_QTY} unidades`, 400);
        }
    }
    try {
        return await stock_movements_repository_1.stockMovementsRepository.createWithStockUpdate({
            productId: input.productId,
            type: "IN",
            quantity: input.quantity,
            reason: input.reason,
            supplier: input.supplier,
            invoiceNumber: input.invoiceNumber,
            note: input.note,
            userId,
            newBatch: input.expirationDate
                ? { batchNumber: input.batchNumber, expirationDate: input.expirationDate }
                : undefined,
        });
    }
    catch (err) {
        if (err instanceof Error && err.message === "NEGATIVE_STOCK") {
            // Não deveria acontecer numa entrada, mas mantemos a mesma rede de segurança.
            throw new AppError_1.AppError("Erro inesperado ao calcular o novo estoque", 500);
        }
        throw err;
    }
}
async function createExit(input, userId) {
    const product = await products_repository_1.productsRepository.findById(input.productId);
    if (!product) {
        throw new AppError_1.AppError("Produto não encontrado", 404);
    }
    if (!product.active) {
        throw new AppError_1.AppError("Não é possível movimentar um produto inativo", 400);
    }
    let consumeBatchId = input.batchId;
    if (product.tracksBatch && !consumeBatchId) {
        // FEFO: sugere automaticamente o lote com validade mais próxima que tenha saldo suficiente.
        const fefoBatch = await stock_movements_repository_1.stockMovementsRepository.findFefoBatch(input.productId, input.quantity);
        if (!fefoBatch) {
            throw new AppError_1.AppError("Nenhum lote possui saldo suficiente para essa saída. Selecione um lote manualmente ou divida a saída em partes menores.", 409);
        }
        consumeBatchId = fefoBatch.id;
    }
    try {
        return await stock_movements_repository_1.stockMovementsRepository.createWithStockUpdate({
            productId: input.productId,
            type: "OUT",
            quantity: input.quantity,
            reason: input.reason,
            supplier: input.supplier,
            invoiceNumber: input.invoiceNumber,
            note: input.note,
            userId,
            consumeBatchId,
        });
    }
    catch (err) {
        if (err instanceof Error && err.message === "NEGATIVE_STOCK") {
            throw new AppError_1.AppError(`Saída não permitida: estoque atual (${product.currentStock}) é menor que a quantidade solicitada (${input.quantity})`, 409);
        }
        if (err instanceof Error && err.message === "BATCH_INSUFFICIENT_QUANTITY") {
            throw new AppError_1.AppError("O lote selecionado não possui saldo suficiente para essa saída", 409);
        }
        if (err instanceof Error && err.message === "BATCH_NOT_FOUND") {
            throw new AppError_1.AppError("Lote não encontrado para este produto", 404);
        }
        throw err;
    }
}
exports.stockMovementsService = {
    list(filters) {
        return stock_movements_repository_1.stockMovementsRepository.list(filters);
    },
    createEntry,
    createExit,
};
//# sourceMappingURL=stock-movements.service.js.map