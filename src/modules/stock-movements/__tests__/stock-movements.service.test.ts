import { describe, expect, it, vi, beforeEach } from "vitest";

// Mocka os repositories antes de importar o service, para que ele use as versões falsas.
vi.mock("../../products/products.repository", () => ({
  productsRepository: { findById: vi.fn() },
}));

vi.mock("../stock-movements.repository", () => ({
  stockMovementsRepository: { createWithStockUpdate: vi.fn(), list: vi.fn() },
}));

import { productsRepository } from "../../products/products.repository";
import { stockMovementsRepository } from "../stock-movements.repository";
import { stockMovementsService } from "../stock-movements.service";

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
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("stockMovementsService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("bloqueia movimentação em produto inativo", async () => {
    vi.mocked(productsRepository.findById).mockResolvedValue({ ...baseProduct, active: false });

    await expect(
      stockMovementsService.createExit(
        { productId: "prod-1", quantity: 5, reason: "USO_INTERNO" },
        "user-1"
      )
    ).rejects.toThrow("Não é possível movimentar um produto inativo");
  });

  it("bloqueia saída quando não existe o produto", async () => {
    vi.mocked(productsRepository.findById).mockResolvedValue(null);

    await expect(
      stockMovementsService.createExit(
        { productId: "prod-x", quantity: 5, reason: "USO_INTERNO" },
        "user-1"
      )
    ).rejects.toThrow("Produto não encontrado");
  });

  it("converte erro NEGATIVE_STOCK do repository numa mensagem clara com os números certos", async () => {
    vi.mocked(productsRepository.findById).mockResolvedValue({ ...baseProduct, currentStock: 3 });
    vi.mocked(stockMovementsRepository.createWithStockUpdate).mockRejectedValue(
      new Error("NEGATIVE_STOCK")
    );

    await expect(
      stockMovementsService.createExit(
        { productId: "prod-1", quantity: 10, reason: "USO_INTERNO" },
        "user-1"
      )
    ).rejects.toThrow(/estoque atual \(3\).*quantidade solicitada \(10\)/);
  });

  it("permite entrada normal quando produto existe e está ativo", async () => {
    vi.mocked(productsRepository.findById).mockResolvedValue(baseProduct);
    vi.mocked(stockMovementsRepository.createWithStockUpdate).mockResolvedValue({
      id: "mov-1",
    } as never);

    const result = await stockMovementsService.createEntry(
      { productId: "prod-1", quantity: 20, reason: "COMPRA" },
      "user-1"
    );

    expect(result).toEqual({ id: "mov-1" });
    expect(stockMovementsRepository.createWithStockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ type: "IN", quantity: 20, productId: "prod-1" })
    );
  });

  it("propaga outros erros inesperados sem mascarar", async () => {
    vi.mocked(productsRepository.findById).mockResolvedValue(baseProduct);
    vi.mocked(stockMovementsRepository.createWithStockUpdate).mockRejectedValue(
      new Error("DB_CONNECTION_LOST")
    );

    await expect(
      stockMovementsService.createEntry(
        { productId: "prod-1", quantity: 5, reason: "COMPRA" },
        "user-1"
      )
    ).rejects.toThrow("DB_CONNECTION_LOST");
  });
});
