"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Mocka os repositories antes de importar o service, para que ele use as versões falsas.
vitest_1.vi.mock("../../products/products.repository", () => ({
    productsRepository: { findById: vitest_1.vi.fn() },
}));
vitest_1.vi.mock("../stock-movements.repository", () => ({
    stockMovementsRepository: { createWithStockUpdate: vitest_1.vi.fn(), list: vitest_1.vi.fn() },
}));
const products_repository_1 = require("../../products/products.repository");
const stock_movements_repository_1 = require("../stock-movements.repository");
const stock_movements_service_1 = require("../stock-movements.service");
const baseProduct = {
    id: "prod-1",
    active: true,
    currentStock: 10,
    minStock: 0,
    maxStock: null,
    name: "Produto Teste",
    sku: "SKU-1",
    barcode: null,
    categoryId: "cat-1",
    unit: "un",
    location: null,
    tracksBatch: false,
    category: {
        id: "cat-1",
        name: "Categoria",
        createdAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
};
(0, vitest_1.describe)("stockMovementsService", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.resetAllMocks();
    });
    (0, vitest_1.it)("bloqueia movimentação em produto inativo", async () => {
        vitest_1.vi.mocked(products_repository_1.productsRepository.findById).mockResolvedValue({ ...baseProduct, active: false });
        await (0, vitest_1.expect)(stock_movements_service_1.stockMovementsService.createExit({ productId: "prod-1", quantity: 5, reason: "USO_INTERNO" }, "user-1")).rejects.toThrow("Não é possível movimentar um produto inativo");
    });
    (0, vitest_1.it)("bloqueia saída quando não existe o produto", async () => {
        vitest_1.vi.mocked(products_repository_1.productsRepository.findById).mockResolvedValue(null);
        await (0, vitest_1.expect)(stock_movements_service_1.stockMovementsService.createExit({ productId: "prod-x", quantity: 5, reason: "USO_INTERNO" }, "user-1")).rejects.toThrow("Produto não encontrado");
    });
    (0, vitest_1.it)("converte erro NEGATIVE_STOCK do repository numa mensagem clara com os números certos", async () => {
        vitest_1.vi.mocked(products_repository_1.productsRepository.findById).mockResolvedValue({ ...baseProduct, currentStock: 3 });
        vitest_1.vi.mocked(stock_movements_repository_1.stockMovementsRepository.createWithStockUpdate).mockRejectedValue(new Error("NEGATIVE_STOCK"));
        await (0, vitest_1.expect)(stock_movements_service_1.stockMovementsService.createExit({ productId: "prod-1", quantity: 10, reason: "USO_INTERNO" }, "user-1")).rejects.toThrow(/estoque atual \(3\).*quantidade solicitada \(10\)/);
    });
    (0, vitest_1.it)("permite entrada normal quando produto existe e está ativo", async () => {
        vitest_1.vi.mocked(products_repository_1.productsRepository.findById).mockResolvedValue(baseProduct);
        vitest_1.vi.mocked(stock_movements_repository_1.stockMovementsRepository.createWithStockUpdate).mockResolvedValue({
            id: "mov-1",
        });
        const result = await stock_movements_service_1.stockMovementsService.createEntry({ productId: "prod-1", quantity: 20, reason: "COMPRA" }, "user-1", "FUNCIONARIO");
        (0, vitest_1.expect)(result).toEqual({ id: "mov-1" });
        (0, vitest_1.expect)(stock_movements_repository_1.stockMovementsRepository.createWithStockUpdate).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ type: "IN", quantity: 20, productId: "prod-1" }));
    });
    (0, vitest_1.it)("propaga outros erros inesperados sem mascarar", async () => {
        vitest_1.vi.mocked(products_repository_1.productsRepository.findById).mockResolvedValue(baseProduct);
        vitest_1.vi.mocked(stock_movements_repository_1.stockMovementsRepository.createWithStockUpdate).mockRejectedValue(new Error("DB_CONNECTION_LOST"));
        await (0, vitest_1.expect)(stock_movements_service_1.stockMovementsService.createEntry({ productId: "prod-1", quantity: 5, reason: "COMPRA" }, "user-1", "FUNCIONARIO")).rejects.toThrow("DB_CONNECTION_LOST");
    });
});
//# sourceMappingURL=stock-movements.service.test.js.map