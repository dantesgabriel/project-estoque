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

  async getByBarcode(barcode: string) {
    const product = await productsRepository.findByBarcode(barcode.trim());

    if (!product) {
      throw new AppError("Produto não encontrado para este código", 404);
    }

    return product;
  },

  async addBarcode(productId: string, barcode: string) {
    const product = await this.getById(productId);
    const normalizedBarcode = barcode.trim();
    const existing = await productsRepository.findByBarcode(normalizedBarcode);

    if (existing) {
      if (existing.id === product.id) return product;
      throw new AppError("Este código de barras já está vinculado a outro produto", 409);
    }

    await productsRepository.createBarcode(product.id, normalizedBarcode);
    return this.getById(product.id);
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

    if (input.barcode && input.barcode !== current.barcode) {
      const existingBarcode = await productsRepository.findByBarcode(input.barcode);
      if (existingBarcode && existingBarcode.id !== id) {
        throw new AppError("Já existe um produto com este código de barras", 409);
      }
    }

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
