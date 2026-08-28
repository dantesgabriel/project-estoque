"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesService = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const categories_repository_1 = require("./categories.repository");
exports.categoriesService = {
    list() {
        return categories_repository_1.categoriesRepository.list();
    },
    async getById(id) {
        const category = await categories_repository_1.categoriesRepository.findById(id);
        if (!category) {
            throw new AppError_1.AppError("Categoria não encontrada", 404);
        }
        return category;
    },
    async create(input) {
        const existing = await categories_repository_1.categoriesRepository.findByName(input.name);
        if (existing) {
            throw new AppError_1.AppError("Já existe uma categoria com esse nome", 409);
        }
        return categories_repository_1.categoriesRepository.create(input);
    },
    async update(id, input) {
        await this.getById(id);
        return categories_repository_1.categoriesRepository.update(id, input);
    },
    async delete(id) {
        await this.getById(id);
        const productsCount = await categories_repository_1.categoriesRepository.countProducts(id);
        // Regra: não deixar excluir categoria que já tem produtos vinculados,
        // para não gerar produtos "órfãos" — mais seguro que orientar o usuário
        // a mover os produtos primeiro.
        if (productsCount > 0) {
            throw new AppError_1.AppError(`Não é possível excluir: existem ${productsCount} produto(s) nessa categoria`, 409);
        }
        await categories_repository_1.categoriesRepository.delete(id);
    },
};
//# sourceMappingURL=categories.service.js.map