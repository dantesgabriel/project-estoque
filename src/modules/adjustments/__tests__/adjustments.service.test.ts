import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../adjustments.repository", () => ({
  adjustmentsRepository: {
    findInventoryItem: vi.fn(),
    createAndApply: vi.fn(),
    list: vi.fn(),
  },
}));

vi.mock("../../products/products.repository", () => ({
  productsRepository: { findById: vi.fn() },
}));

import { adjustmentsRepository } from "../adjustments.repository";
import { productsRepository } from "../../products/products.repository";
import { adjustmentsService } from "../adjustments.service";

describe("adjustmentsService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("createFromInventory", () => {
    it("bloqueia quando o item de inventário não existe", async () => {
      vi.mocked(adjustmentsRepository.findInventoryItem).mockResolvedValue(null);

      await expect(
        adjustmentsService.createFromInventory(
          { inventoryItemId: "item-x", reason: "PERDA" },
          "user-1"
        )
      ).rejects.toThrow("Item de inventário não encontrado");
    });

    it("bloqueia quando o item ainda não foi contado", async () => {
      vi.mocked(adjustmentsRepository.findInventoryItem).mockResolvedValue({
        id: "item-1",
        countedQty: null,
        divergence: null,
        adjustment: null,
      } as never);

      await expect(
        adjustmentsService.createFromInventory(
          { inventoryItemId: "item-1", reason: "PERDA" },
          "user-1"
        )
      ).rejects.toThrow("ainda não foi contado");
    });

    it("bloqueia quando o item já possui um ajuste registrado", async () => {
      vi.mocked(adjustmentsRepository.findInventoryItem).mockResolvedValue({
        id: "item-1",
        countedQty: 10,
        divergence: -5,
        adjustment: { id: "adj-1" },
      } as never);

      await expect(
        adjustmentsService.createFromInventory(
          { inventoryItemId: "item-1", reason: "PERDA" },
          "user-1"
        )
      ).rejects.toThrow("já possui um ajuste registrado");
    });

    it("bloqueia quando não há divergência (ajuste desnecessário)", async () => {
      vi.mocked(adjustmentsRepository.findInventoryItem).mockResolvedValue({
        id: "item-1",
        countedQty: 20,
        divergence: 0,
        adjustment: null,
      } as never);

      await expect(
        adjustmentsService.createFromInventory(
          { inventoryItemId: "item-1", reason: "PERDA" },
          "user-1"
        )
      ).rejects.toThrow("ajuste desnecessário");
    });

    it("aplica o ajuste corretamente quando tudo está válido", async () => {
      vi.mocked(adjustmentsRepository.findInventoryItem).mockResolvedValue({
        id: "item-1",
        productId: "prod-1",
        expectedQty: 20,
        countedQty: 15,
        divergence: -5,
        adjustment: null,
      } as never);
      vi.mocked(adjustmentsRepository.createAndApply).mockResolvedValue({ id: "adj-1" } as never);

      const result = await adjustmentsService.createFromInventory(
        { inventoryItemId: "item-1", reason: "PERDA", note: "teste" },
        "user-1"
      );

      expect(result).toEqual({ id: "adj-1" });
      expect(adjustmentsRepository.createAndApply).toHaveBeenCalledWith({
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

  describe("createManual", () => {
    it("bloqueia quando produto não existe", async () => {
      vi.mocked(productsRepository.findById).mockResolvedValue(null);

      await expect(
        adjustmentsService.createManual(
          { productId: "prod-x", newQty: 10, reason: "ERRO_CADASTRO" },
          "user-1"
        )
      ).rejects.toThrow("Produto não encontrado");
    });

    it("bloqueia quando a nova quantidade é igual à atual", async () => {
      vi.mocked(productsRepository.findById).mockResolvedValue({
        id: "prod-1",
        currentStock: 10,
      } as never);

      await expect(
        adjustmentsService.createManual(
          { productId: "prod-1", newQty: 10, reason: "ERRO_CADASTRO" },
          "user-1"
        )
      ).rejects.toThrow("ajuste desnecessário");
    });
  });
});
