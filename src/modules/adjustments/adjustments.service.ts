import { AppError } from "../../shared/errors/AppError";
import { productsRepository } from "../products/products.repository";
import { adjustmentsRepository } from "./adjustments.repository";
import { CreateAdjustmentFromInventoryInput, CreateManualAdjustmentInput } from "./adjustments.schema";

export const adjustmentsService = {
  list() {
    return adjustmentsRepository.list();
  },

  async createFromInventory(input: CreateAdjustmentFromInventoryInput, userId: string) {
    const item = await adjustmentsRepository.findInventoryItem(input.inventoryItemId);

    if (!item) {
      throw new AppError("Item de inventário não encontrado", 404);
    }

    if (item.countedQty === null) {
      throw new AppError("Este item ainda não foi contado", 400);
    }

    if (item.adjustment) {
      throw new AppError("Este item já possui um ajuste registrado", 409);
    }

    if (item.divergence === 0) {
      throw new AppError("Este item não apresenta divergência, ajuste desnecessário", 400);
    }

    return adjustmentsRepository.createAndApply({
      productId: item.productId,
      inventoryItemId: item.id,
      previousQty: item.expectedQty,
      newQty: item.countedQty,
      reason: input.reason,
      note: input.note,
      userId,
    });
  },

  async createManual(input: CreateManualAdjustmentInput, userId: string) {
    const product = await productsRepository.findById(input.productId);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    if (product.currentStock === input.newQty) {
      throw new AppError("A nova quantidade é igual ao estoque atual, ajuste desnecessário", 400);
    }

    return adjustmentsRepository.createAndApply({
      productId: input.productId,
      previousQty: product.currentStock,
      newQty: input.newQty,
      reason: input.reason,
      note: input.note,
      userId,
    });
  },
};
