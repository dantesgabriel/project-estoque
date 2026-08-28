"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsService = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const categories_repository_1 = require("../categories/categories.repository");
const products_repository_1 = require("./products.repository");
exports.productsService = {
    list(filters) {
        return products_repository_1.productsRepository.list(filters);
    },
    async getById(id) {
        const product = await products_repository_1.productsRepository.findById(id);
        if (!product) {
            throw new AppError_1.AppError("Produto não encontrado", 404);
        }
        return product;
    },
    async create(input) {
        const category = await categories_repository_1.categoriesRepository.findById(input.categoryId);
        if (!category) {
            throw new AppError_1.AppError("Categoria informada não existe", 400);
        }
        const existingSku = await products_repository_1.productsRepository.findBySku(input.sku);
        if (existingSku) {
            throw new AppError_1.AppError("Já existe um produto com esse SKU", 409);
        }
        if (input.barcode) {
            const existingBarcode = await products_repository_1.productsRepository.findByBarcode(input.barcode);
            if (existingBarcode) {
                throw new AppError_1.AppError("Já existe um produto com esse código de barras", 409);
            }
        }
        if (input.maxStock !== undefined && input.maxStock < input.minStock) {
            throw new AppError_1.AppError("Estoque máximo não pode ser menor que o estoque mínimo", 400);
        }
        return products_repository_1.productsRepository.create(input);
    },
    async update(id, input) {
        const current = await this.getById(id);
        if (input.categoryId) {
            const category = await categories_repository_1.categoriesRepository.findById(input.categoryId);
            if (!category) {
                throw new AppError_1.AppError("Categoria informada não existe", 400);
            }
        }
        const nextMin = input.minStock ?? current.minStock;
        const nextMax = input.maxStock ?? current.maxStock;
        if (nextMax !== null && nextMax !== undefined && nextMax < nextMin) {
            throw new AppError_1.AppError("Estoque máximo não pode ser menor que o estoque mínimo", 400);
        }
        return products_repository_1.productsRepository.update(id, input);
    },
};
//# sourceMappingURL=products.service.js.map