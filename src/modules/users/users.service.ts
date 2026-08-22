import bcrypt from "bcryptjs";
import { AppError } from "../../shared/errors/AppError";
import { usersRepository } from "./users.repository";
import { ChangePasswordInput, CreateUserInput, ResetPasswordInput, UpdateUserInput } from "./users.schema";

const SALT_ROUNDS = 10;

export const usersService = {
  async create(input: CreateUserInput) {
    const existing = await usersRepository.findByEmail(input.email);

    if (existing) {
      throw new AppError("Já existe um usuário com esse email", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    return usersRepository.create({ ...input, passwordHash });
  },

  list() {
    return usersRepository.list();
  },

  async getById(id: string) {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return user;
  },

  async update(id: string, input: UpdateUserInput) {
    await this.getById(id); // garante que existe antes de tentar atualizar
    return usersRepository.update(id, input);
  },

  // Admin redefine a senha de qualquer usuário — não exige a senha atual.
  async resetPassword(id: string, input: ResetPasswordInput) {
    await this.getById(id);
    const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
    return usersRepository.updatePassword(id, passwordHash);
  },

  // Usuário troca a própria senha — precisa confirmar a senha atual.
  async changeOwnPassword(id: string, input: ChangePasswordInput) {
    const user = await usersRepository.findByIdWithPassword(id);

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const matches = await bcrypt.compare(input.currentPassword, user.passwordHash);

    if (!matches) {
      throw new AppError("Senha atual incorreta", 401);
    }

    const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
    return usersRepository.updatePassword(id, passwordHash);
  },
};
