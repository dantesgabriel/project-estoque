"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suppliersService = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const suppliers_repository_1 = require("./suppliers.repository");
exports.suppliersService = {
    list() {
        return suppliers_repository_1.suppliersRepository.list();
    },
    async getById(id) {
        const supplier = await suppliers_repository_1.suppliersRepository.findById(id);
        if (!supplier)
            throw new AppError_1.AppError("Fornecedor não encontrado", 404);
        return supplier;
    },
    async create(input) {
        if (await suppliers_repository_1.suppliersRepository.findByName(input.name)) {
            throw new AppError_1.AppError("Já existe um fornecedor com esse nome", 409);
        }
        if (input.document && await suppliers_repository_1.suppliersRepository.findByDocument(input.document)) {
            throw new AppError_1.AppError("Já existe um fornecedor com esse CNPJ/CPF", 409);
        }
        return suppliers_repository_1.suppliersRepository.create(input);
    },
    async update(id, input) {
        const current = await this.getById(id);
        if (input.name && input.name !== current.name && await suppliers_repository_1.suppliersRepository.findByName(input.name)) {
            throw new AppError_1.AppError("Já existe um fornecedor com esse nome", 409);
        }
        if (input.document && input.document !== current.document && await suppliers_repository_1.suppliersRepository.findByDocument(input.document)) {
            throw new AppError_1.AppError("Já existe um fornecedor com esse CNPJ/CPF", 409);
        }
        return suppliers_repository_1.suppliersRepository.update(id, input);
    },
    async delete(id) {
        await this.getById(id);
        if (await suppliers_repository_1.suppliersRepository.countMovements(id)) {
            throw new AppError_1.AppError("Não é possível excluir fornecedor usado em movimentações; desative-o em vez disso", 409);
        }
        await suppliers_repository_1.suppliersRepository.delete(id);
    },
};
//# sourceMappingURL=suppliers.service.js.map