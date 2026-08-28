"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock("../adjustments.repository", () => ({
    adjustmentsRepository: {
        findInventoryItem: vitest_1.vi.fn(),
        createAndApply: vitest_1.vi.fn(),
        list: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock("../../products/products.repository", () => ({
    productsRepository: { findById: vitest_1.vi.fn() },
}));
const adjustments_repository_1 = require("../adjustments.repository");
const products_repository_1 = require("../../products/products.repository");
const adjustments_service_1 = require("../adjustments.service");
(0, vitest_1.describe)("adjustmentsService", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.resetAllMocks();
    });
    (0, vitest_1.describe)("createFromInventory", () => {
        (0, vitest_1.it)("bloqueia quando o item de inventário não existe", async () => {
            vitest_1.vi.mocked(adjustments_repository_1.adjustmentsRepository.findInventoryItem).mockResolvedValue(null);
            await (0, vitest_1.expect)(adjustments_service_1.adjustmentsService.createFromInventory({ inventoryItemId: "item-x", reason: "PERDA" }, "user-1")).rejects.toThrow("Item de inventário não encontrado");
        });
        (0, vitest_1.it)("bloqueia quando o item ainda não foi contado", async () => {
            vitest_1.vi.mocked(adjustments_repository_1.adjustmentsRepository.findInventoryItem).mockResolvedValue({
                id: "item-1",
                countedQty: null,
                divergence: null,
                adjustment: null,
            });
            await (0, vitest_1.expect)(adjustments_service_1.adjustmentsService.createFromInventory({ inventoryItemId: "item-1", reason: "PERDA" }, "user-1")).rejects.toThrow("ainda não foi contado");
        });
        (0, vitest_1.it)("bloqueia quando o item já possui um ajuste registrado", async () => {
            vitest_1.vi.mocked(adjustments_repository_1.adjustmentsRepository.findInventoryItem).mockResolvedValue({
                id: "item-1",
                countedQty: 10,
                divergence: -5,
                adjustment: { id: "adj-1" },
            });
            await (0, vitest_1.expect)(adjustments_service_1.adjustmentsService.createFromInventory({ inventoryItemId: "item-1", reason: "PERDA" }, "user-1")).rejects.toThrow("já possui um ajuste registrado");
        });
        (0, vitest_1.it)("bloqueia quando não há divergência (ajuste desnecessário)", async () => {
            vitest_1.vi.mocked(adjustments_repository_1.adjustmentsRepository.findInventoryItem).mockResolvedValue({
                id: "item-1",
                countedQty: 20,
                divergence: 0,
                adjustment: null,
            });
            await (0, vitest_1.expect)(adjustments_service_1.adjustmentsService.createFromInventory({ inventoryItemId: "item-1", reason: "PERDA" }, "user-1")).rejects.toThrow("ajuste desnecessário");
        });
        (0, vitest_1.it)("aplica o ajuste corretamente quando tudo está válido", async () => {
            vitest_1.vi.mocked(adjustments_repository_1.adjustmentsRepository.findInventoryItem).mockResolvedValue({
                id: "item-1",
                productId: "prod-1",
                expectedQty: 20,
                countedQty: 15,
                divergence: -5,
                adjustment: null,
            });
            vitest_1.vi.mocked(adjustments_repository_1.adjustmentsRepository.createAndApply).mockResolvedValue({ id: "adj-1" });
            const result = await adjustments_service_1.adjustmentsService.createFromInventory({ inventoryItemId: "item-1", reason: "PERDA", note: "teste" }, "user-1");
            (0, vitest_1.expect)(result).toEqual({ id: "adj-1" });
            (0, vitest_1.expect)(adjustments_repository_1.adjustmentsRepository.createAndApply).toHaveBeenCalledWith({
                productId: "prod-1",
                inventoryItemId: "item-1",
                previousQty: 20,
                newQty: 15,
                reason: "PERDA",
                note: "teste",
                userId: "user-1",
            });
        });
    });
    (0, vitest_1.describe)("createManual", () => {
        (0, vitest_1.it)("bloqueia quando produto não existe", async () => {
            vitest_1.vi.mocked(products_repository_1.productsRepository.findById).mockResolvedValue(null);
            await (0, vitest_1.expect)(adjustments_service_1.adjustmentsService.createManual({ productId: "prod-x", newQty: 10, reason: "ERRO_CADASTRO" }, "user-1")).rejects.toThrow("Produto não encontrado");
        });
        (0, vitest_1.it)("bloqueia quando a nova quantidade é igual à atual", async () => {
            vitest_1.vi.mocked(products_repository_1.productsRepository.findById).mockResolvedValue({
                id: "prod-1",
                currentStock: 10,
            });
            await (0, vitest_1.expect)(adjustments_service_1.adjustmentsService.createManual({ productId: "prod-1", newQty: 10, reason: "ERRO_CADASTRO" }, "user-1")).rejects.toThrow("ajuste desnecessário");
        });
    });
});
//# sourceMappingURL=adjustments.service.test.js.map