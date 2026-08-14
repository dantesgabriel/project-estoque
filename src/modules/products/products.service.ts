import { AppError } from "../../shared/errors/AppError";
import { categoriesRepository } from "../categories/categories.repository";
import { productsRepository } from "./products.repository";
import { CreateProductInput, ListProductsQuery, UpdateProductInput } from "./products.schema";

export const productsService = {
  list(filters: ListProductsQuery) {
    return productsRepository.list(filters);
  },

  async getById(id: string) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    return product;
  },

  async create(input: CreateProductInput) {
    const category = await categoriesRepository.findById(input.categoryId);

    if (!category) {
      throw new AppError("Categoria informada não existe", 400);
    }

    const existingSku = await productsRepository.findBySku(input.sku);

    if (existingSku) {
      throw new AppError("Já existe um produto com esse SKU", 409);
    }

    if (input.barcode) {
      const existingBarcode = await productsRepository.findByBarcode(input.barcode);

      if (existingBarcode) {
        throw new AppError("Já existe um produto com esse código de barras", 409);
      }
    }

    if (input.maxStock !== undefined && input.maxStock < input.minStock) {
      throw new AppError("Estoque máximo não pode ser menor que o estoque mínimo", 400);
    }

    return productsRepository.create(input);
  },

  async update(id: string, input: UpdateProductInput) {
    const current = await this.getById(id);

    if (input.categoryId) {
      const category = await categoriesRepository.findById(input.categoryId);

      if (!category) {
        throw new AppError("Categoria informada não existe", 400);
      }
    }

    const nextMin = input.minStock ?? current.minStock;
    const nextMax = input.maxStock ?? current.maxStock;

    if (nextMax !== null && nextMax !== undefined && nextMax < nextMin) {
      throw new AppError("Estoque máximo não pode ser menor que o estoque mínimo", 400);
    }

    return productsRepository.update(id, input);
  },
};