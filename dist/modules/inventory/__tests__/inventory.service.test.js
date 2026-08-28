"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock("../inventory.repository", () => ({
    inventoryRepository: {
        findInProgress: vitest_1.vi.fn(),
        findById: vitest_1.vi.fn(),
        findItemById: vitest_1.vi.fn(),
        createWithItems: vitest_1.vi.fn(),
        updateItemCount: vitest_1.vi.fn(),
        closeInventory: vitest_1.vi.fn(),
        list: vitest_1.vi.fn(),
    },
}));
const inventory_repository_1 = require("../inventory.repository");
const inventory_service_1 = require("../inventory.service");
function makeInventory(overrides = {}) {
    return {
        id: "inv-1",
        name: "Inventário Teste",
        status: "IN_PROGRESS",
        blindMode: false,
        items: [
            { id: "item-1", expectedQty: 20, countedQty: null, divergence: null },
            { id: "item-2", expectedQty: 5, countedQty: null, divergence: null },
        ],
        ...overrides,
    };
}
(0, vitest_1.describe)("inventoryService", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.resetAllMocks();
    });
    (0, vitest_1.describe)("create", () => {
        (0, vitest_1.it)("bloqueia criar novo inventário se já existe um em andamento", async () => {
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findInProgress).mockResolvedValue({
                id: "inv-antigo",
                name: "Antigo",
            });
            await (0, vitest_1.expect)(inventory_service_1.inventoryService.create({ name: "Novo", blindMode: false }, "user-1")).rejects.toThrow(/já existe um inventário em andamento/i);
            (0, vitest_1.expect)(inventory_repository_1.inventoryRepository.createWithItems).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)("cria normalmente quando não há inventário em andamento", async () => {
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findInProgress).mockResolvedValue(null);
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.createWithItems).mockResolvedValue({ id: "inv-novo" });
            const result = await inventory_service_1.inventoryService.create({ name: "Novo", blindMode: true }, "user-1");
            (0, vitest_1.expect)(result).toEqual({ id: "inv-novo" });
        });
        (0, vitest_1.it)("converte erro de nenhum produto ativo numa mensagem clara", async () => {
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findInProgress).mockResolvedValue(null);
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.createWithItems).mockRejectedValue(new Error("NO_PRODUCTS_TO_COUNT"));
            await (0, vitest_1.expect)(inventory_service_1.inventoryService.create({ name: "Novo", blindMode: false }, "user-1")).rejects.toThrow("Nenhum produto ativo encontrado para contagem");
        });
    });
    (0, vitest_1.describe)("getForCounting (modo cego)", () => {
        (0, vitest_1.it)("remove expectedQty dos itens quando blindMode é true", async () => {
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findById).mockResolvedValue(makeInventory({ blindMode: true }));
            const result = await inventory_service_1.inventoryService.getForCounting("inv-1");
            for (const item of result.items) {
                (0, vitest_1.expect)(item).not.toHaveProperty("expectedQty");
            }
        });
        (0, vitest_1.it)("mantém expectedQty visível quando blindMode é false", async () => {
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findById).mockResolvedValue(makeInventory({ blindMode: false }));
            const result = await inventory_service_1.inventoryService.getForCounting("inv-1");
            (0, vitest_1.expect)(result.items[0]).toHaveProperty("expectedQty", 20);
        });
    });
    (0, vitest_1.describe)("submitCount (cálculo de divergência)", () => {
        (0, vitest_1.it)("calcula divergência negativa quando contagem é menor que o esperado", async () => {
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findById).mockResolvedValue(makeInventory());
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findItemById).mockResolvedValue({
                id: "item-1",
                expectedQty: 20,
            });
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.updateItemCount).mockResolvedValue({});
            await inventory_service_1.inventoryService.submitCount("inv-1", "item-1", { countedQty: 15 });
            (0, vitest_1.expect)(inventory_repository_1.inventoryRepository.updateItemCount).toHaveBeenCalledWith("item-1", 15, undefined, -5);
        });
        (0, vitest_1.it)("calcula divergência positiva quando contagem é maior que o esperado", async () => {
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findById).mockResolvedValue(makeInventory());
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findItemById).mockResolvedValue({
                id: "item-1",
                expectedQty: 20,
            });
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.updateItemCount).mockResolvedValue({});
            await inventory_service_1.inventoryService.submitCount("inv-1", "item-1", { countedQty: 25 });
            (0, vitest_1.expect)(inventory_repository_1.inventoryRepository.updateItemCount).toHaveBeenCalledWith("item-1", 25, undefined, 5);
        });
        (0, vitest_1.it)("bloqueia contagem em inventário já finalizado", async () => {
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findById).mockResolvedValue(makeInventory({ status: "COMPLETED" }));
            await (0, vitest_1.expect)(inventory_service_1.inventoryService.submitCount("inv-1", "item-1", { countedQty: 10 })).rejects.toThrow(/já foi finalizado/i);
        });
    });
    (0, vitest_1.describe)("close", () => {
        (0, vitest_1.it)("bloqueia fechamento quando existem itens sem contagem", async () => {
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findById).mockResolvedValue(makeInventory());
            await (0, vitest_1.expect)(inventory_service_1.inventoryService.close("inv-1", "user-1")).rejects.toThrow(/sem contagem registrada/i);
            (0, vitest_1.expect)(inventory_repository_1.inventoryRepository.closeInventory).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)("fecha normalmente quando todos os itens foram contados", async () => {
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.findById).mockResolvedValue(makeInventory({
                items: [
                    { id: "item-1", expectedQty: 20, countedQty: 20, divergence: 0 },
                    { id: "item-2", expectedQty: 5, countedQty: 3, divergence: -2 },
                ],
            }));
            vitest_1.vi.mocked(inventory_repository_1.inventoryRepository.closeInventory).mockResolvedValue({ id: "inv-1" });
            const result = await inventory_service_1.inventoryService.close("inv-1", "user-1");
            (0, vitest_1.expect)(result).toEqual({ id: "inv-1" });
            (0, vitest_1.expect)(inventory_repository_1.inventoryRepository.closeInventory).toHaveBeenCalledWith("inv-1", "user-1");
        });
    });
});
//# sourceMappingURL=inventory.service.test.js.map