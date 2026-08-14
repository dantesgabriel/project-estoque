import { AppError } from "../../shared/errors/AppError";
import { categoriesRepository } from "./categories.repository";
import { CreateCategoryInput, UpdateCategoryInput } from "./categories.schema";

export const categoriesService = {
  list() {
    return categoriesRepository.list();
  },

  async getById(id: string) {
    const category = await categoriesRepository.findById(id);

    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }

    return category;
  },

  async create(input: CreateCategoryInput) {
    const existing = await categoriesRepository.findByName(input.name);

    if (existing) {
      throw new AppError("Já existe uma categoria com esse nome", 409);
    }

    return categoriesRepository.create(input);
  },

  async update(id: string, input: UpdateCategoryInput) {
    await this.getById(id);
    return categoriesRepository.update(id, input);
  },

  async delete(id: string) {
    await this.getById(id);

    const productsCount = await categoriesRepository.countProducts(id);

    // Regra: não deixar excluir categoria que já tem produtos vinculados,
    // para não gerar produtos "órfãos" — mais seguro que orientar o usuário
    // a mover os produtos primeiro.
    if (productsCount > 0) {
      throw new AppError(
        `Não é possível excluir: existem ${productsCount} produto(s) nessa categoria`,
        409
      );
    }

    await categoriesRepository.delete(id);
  },
};
