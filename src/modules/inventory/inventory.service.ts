import { AppError } from "../../shared/errors/AppError";
import { inventoryRepository } from "./inventory.repository";
import { CountItemInput, CreateInventoryInput } from "./inventory.schema";

export const inventoryService = {
  list() {
    return inventoryRepository.list();
  },

  async getById(id: string) {
    const inventory = await inventoryRepository.findById(id);

    if (!inventory) {
      throw new AppError("Inventário não encontrado", 404);
    }

    return inventory;
  },

  // Retorna o inventário formatado de acordo com o modo cego: se blindMode,
  // remove expectedQty da resposta pra não influenciar quem está contando.
  async getForCounting(id: string) {
    const inventory = await this.getById(id);

    if (!inventory.blindMode) {
      return inventory;
    }

    return {
      ...inventory,
      items: inventory.items.map((item) => {
        const { expectedQty: _expectedQty, ...rest } = item;
        return rest;
      }),
    };
  },

  async create(input: CreateInventoryInput, responsibleId: string) {
    // Regra decidida: apenas 1 inventário em andamento por vez.
    const inProgress = await inventoryRepository.findInProgress();

    if (inProgress) {
      throw new AppError(
        `Já existe um inventário em andamento ("${inProgress.name}"). Finalize-o antes de abrir outro.`,
        409
      );
    }

    try {
      return await inventoryRepository.createWithItems({
        name: input.name,
        blindMode: input.blindMode,
        responsibleId,
        productIds: input.productIds,
      });
    } catch (err) {
      if (err instanceof Error && err.message === "NO_PRODUCTS_TO_COUNT") {
        throw new AppError("Nenhum produto ativo encontrado para contagem", 400);
      }
      throw err;
    }
  },

  async submitCount(inventoryId: string, itemId: string, input: CountItemInput) {
    const inventory = await this.getById(inventoryId);

    if (inventory.status !== "IN_PROGRESS") {
      throw new AppError("Este inventário já foi finalizado", 400);
    }

    const item = await inventoryRepository.findItemById(inventoryId, itemId);

    if (!item) {
      throw new AppError("Item de inventário não encontrado", 404);
    }

    const divergence = input.countedQty - item.expectedQty;

    return inventoryRepository.updateItemCount(itemId, input.countedQty, input.note, divergence);
  },

  async close(id: string, userId: string) {
    const inventory = await this.getById(id);

    if (inventory.status !== "IN_PROGRESS") {
      throw new AppError("Este inventário já foi finalizado", 400);
    }

    const uncounted = inventory.items.filter((item) => item.countedQty === null);

    if (uncounted.length > 0) {
      throw new AppError(
        `Ainda existem ${uncounted.length} produto(s) sem contagem registrada`,
        400
      );
    }

    return inventoryRepository.closeInventory(id, userId);
  },
};
