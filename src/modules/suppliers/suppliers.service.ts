import { AppError } from "../../shared/errors/AppError";
import { CreateSupplierInput, UpdateSupplierInput } from "./suppliers.schema";
import { suppliersRepository } from "./suppliers.repository";

export const suppliersService = {
  list() {
    return suppliersRepository.list();
  },
  async getById(id: string) {
    const supplier = await suppliersRepository.findById(id);
    if (!supplier) throw new AppError("Fornecedor não encontrado", 404);
    return supplier;
  },
  async create(input: CreateSupplierInput) {
    if (await suppliersRepository.findByName(input.name)) {
      throw new AppError("Já existe um fornecedor com esse nome", 409);
    }
    if (input.document && await suppliersRepository.findByDocument(input.document)) {
      throw new AppError("Já existe um fornecedor com esse CNPJ/CPF", 409);
    }
    return suppliersRepository.create(input);
  },
  async update(id: string, input: UpdateSupplierInput) {
    const current = await this.getById(id);
    if (input.name && input.name !== current.name && await suppliersRepository.findByName(input.name)) {
      throw new AppError("Já existe um fornecedor com esse nome", 409);
    }
    if (input.document && input.document !== current.document && await suppliersRepository.findByDocument(input.document)) {
      throw new AppError("Já existe um fornecedor com esse CNPJ/CPF", 409);
    }
    return suppliersRepository.update(id, input);
  },
  async delete(id: string) {
    await this.getById(id);
    if (await suppliersRepository.countMovements(id)) {
      throw new AppError("Não é possível excluir fornecedor usado em movimentações; desative-o em vez disso", 409);
    }
    await suppliersRepository.delete(id);
  },
};
