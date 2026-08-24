import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../inventory.repository", () => ({
  inventoryRepository: {
    findInProgress: vi.fn(),
    findById: vi.fn(),
    findItemById: vi.fn(),
    createWithItems: vi.fn(),
    updateItemCount: vi.fn(),
    closeInventory: vi.fn(),
    list: vi.fn(),
  },
}));

import { inventoryRepository } from "../inventory.repository";
import { inventoryService } from "../inventory.service";

function makeInventory(overrides: Partial<Record<string, unknown>> = {}) {
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

describe("inventoryService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("create", () => {
    it("bloqueia criar novo inventário se já existe um em andamento", async () => {
      vi.mocked(inventoryRepository.findInProgress).mockResolvedValue({
        id: "inv-antigo",
        name: "Antigo",
      } as never);

      await expect(
        inventoryService.create({ name: "Novo", blindMode: false }, "user-1")
      ).rejects.toThrow(/já existe um inventário em andamento/i);

      expect(inventoryRepository.createWithItems).not.toHaveBeenCalled();
    });

    it("cria normalmente quando não há inventário em andamento", async () => {
      vi.mocked(inventoryRepository.findInProgress).mockResolvedValue(null);
      vi.mocked(inventoryRepository.createWithItems).mockResolvedValue({ id: "inv-novo" } as never);

      const result = await inventoryService.create(
        { name: "Novo", blindMode: true },
        "user-1"
      );

      expect(result).toEqual({ id: "inv-novo" });
    });

    it("converte erro de nenhum produto ativo numa mensagem clara", async () => {
      vi.mocked(inventoryRepository.findInProgress).mockResolvedValue(null);
      vi.mocked(inventoryRepository.createWithItems).mockRejectedValue(
        new Error("NO_PRODUCTS_TO_COUNT")
      );

      await expect(
        inventoryService.create({ name: "Novo", blindMode: false }, "user-1")
      ).rejects.toThrow("Nenhum produto ativo encontrado para contagem");
    });
  });

  describe("getForCounting (modo cego)", () => {
    it("remove expectedQty dos itens quando blindMode é true", async () => {
      vi.mocked(inventoryRepository.findById).mockResolvedValue(
        makeInventory({ blindMode: true }) as never
      );

      const result = await inventoryService.getForCounting("inv-1");

      for (const item of result.items) {
        expect(item).not.toHaveProperty("expectedQty");
      }
    });

    it("mantém expectedQty visível quando blindMode é false", async () => {
      vi.mocked(inventoryRepository.findById).mockResolvedValue(
        makeInventory({ blindMode: false }) as never
      );

      const result = await inventoryService.getForCounting("inv-1");

      expect(result.items[0]).toHaveProperty("expectedQty", 20);
    });
  });

  describe("submitCount (cálculo de divergência)", () => {
    it("calcula divergência negativa quando contagem é menor que o esperado", async () => {
      vi.mocked(inventoryRepository.findById).mockResolvedValue(makeInventory() as never);
      vi.mocked(inventoryRepository.findItemById).mockResolvedValue({
        id: "item-1",
        expectedQty: 20,
      } as never);
      vi.mocked(inventoryRepository.updateItemCount).mockResolvedValue({} as never);

      await inventoryService.submitCount("inv-1", "item-1", { countedQty: 15 });

      expect(inventoryRepository.updateItemCount).toHaveBeenCalledWith(
        "item-1",
        15,
        undefined,
        -5
      );
    });

    it("calcula divergência positiva quando contagem é maior que o esperado", async () => {
      vi.mocked(inventoryRepository.findById).mockResolvedValue(makeInventory() as never);
      vi.mocked(inventoryRepository.findItemById).mockResolvedValue({
        id: "item-1",
        expectedQty: 20,
      } as never);
      vi.mocked(inventoryRepository.updateItemCount).mockResolvedValue({} as never);

      await inventoryService.submitCount("inv-1", "item-1", { countedQty: 25 });

      expect(inventoryRepository.updateItemCount).toHaveBeenCalledWith(
        "item-1",
        25,
        undefined,
        5
      );
    });

    it("bloqueia contagem em inventário já finalizado", async () => {
      vi.mocked(inventoryRepository.findById).mockResolvedValue(
        makeInventory({ status: "COMPLETED" }) as never
      );

      await expect(
        inventoryService.submitCount("inv-1", "item-1", { countedQty: 10 })
      ).rejects.toThrow(/já foi finalizado/i);
    });
  });

  describe("close", () => {
    it("bloqueia fechamento quando existem itens sem contagem", async () => {
      vi.mocked(inventoryRepository.findById).mockResolvedValue(makeInventory() as never);

      await expect(inventoryService.close("inv-1", "user-1")).rejects.toThrow(
        /sem contagem registrada/i
      );

      expect(inventoryRepository.closeInventory).not.toHaveBeenCalled();
    });

    it("fecha normalmente quando todos os itens foram contados", async () => {
      vi.mocked(inventoryRepository.findById).mockResolvedValue(
        makeInventory({
          items: [
            { id: "item-1", expectedQty: 20, countedQty: 20, divergence: 0 },
            { id: "item-2", expectedQty: 5, countedQty: 3, divergence: -2 },
          ],
        }) as never
      );
      vi.mocked(inventoryRepository.closeInventory).mockResolvedValue({ id: "inv-1" } as never);

      const result = await inventoryService.close("inv-1", "user-1");

      expect(result).toEqual({ id: "inv-1" });
      expect(inventoryRepository.closeInventory).toHaveBeenCalledWith("inv-1", "user-1");
    });
  });
});
