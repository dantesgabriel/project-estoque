import { AppError } from "../../shared/errors/AppError";
import { productsRepository } from "../products/products.repository";
import { stockMovementsRepository } from "./stock-movements.repository";
import { CreateMovementInput, ListMovementsQuery } from "./stock-movements.schema";

async function createMovement(
  type: "IN" | "OUT",
  input: CreateMovementInput,
  userId: string
) {
  const product = await productsRepository.findById(input.productId);

  if (!product) {
    throw new AppError("Produto não encontrado", 404);
  }

  if (!product.active) {
    throw new AppError("Não é possível movimentar um produto inativo", 400);
  }

  try {
    return await stockMovementsRepository.createWithStockUpdate({
      productId: input.productId,
      type,
      quantity: input.quantity,
      reason: input.reason,
      supplier: input.supplier,
      invoiceNumber: input.invoiceNumber,
      note: input.note,
      userId,
    });
  } catch (err) {
    // Regra 8 do documento: impedir estoque negativo (sem exceção configurada ainda no MVP).
    if (err instanceof Error && err.message === "NEGATIVE_STOCK") {
      throw new AppError(
        `Saída não permitida: estoque atual (${product.currentStock}) é menor que a quantidade solicitada (${input.quantity})`,
        409
      );
    }

    throw err;
  }
}

export const stockMovementsService = {
  list(filters: ListMovementsQuery) {
    return stockMovementsRepository.list(filters);
  },

  createEntry(input: CreateMovementInput, userId: string) {
    return createMovement("IN", input, userId);
  },

  createExit(input: CreateMovementInput, userId: string) {
    return createMovement("OUT", input, userId);
  },
};
