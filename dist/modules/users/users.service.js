"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = require("../../shared/errors/AppError");
const users_repository_1 = require("./users.repository");
const SALT_ROUNDS = 10;
exports.usersService = {
    async create(input) {
        const existing = await users_repository_1.usersRepository.findByEmail(input.email);
        if (existing) {
            throw new AppError_1.AppError("Já existe um usuário com esse email", 409);
        }
        const passwordHash = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
        return users_repository_1.usersRepository.create({ ...input, passwordHash });
    },
    list() {
        return users_repository_1.usersRepository.list();
    },
    async getById(id) {
        const user = await users_repository_1.usersRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError("Usuário não encontrado", 404);
        }
        return user;
    },
    async update(id, input) {
        await this.getById(id); // garante que existe antes de tentar atualizar
        return users_repository_1.usersRepository.update(id, input);
    },
    // Admin redefine a senha de qualquer usuário — não exige a senha atual.
    async resetPassword(id, input) {
        await this.getById(id);
        const passwordHash = await bcryptjs_1.default.hash(input.newPassword, SALT_ROUNDS);
        return users_repository_1.usersRepository.updatePassword(id, passwordHash);
    },
    // Usuário troca a própria senha — precisa confirmar a senha atual.
    async changeOwnPassword(id, input) {
        const user = await users_repository_1.usersRepository.findByIdWithPassword(id);
        if (!user) {
            throw new AppError_1.AppError("Usuário não encontrado", 404);
        }
        const matches = await bcryptjs_1.default.compare(input.currentPassword, user.passwordHash);
        if (!matches) {
            throw new AppError_1.AppError("Senha atual incorreta", 401);
        }
        const passwordHash = await bcryptjs_1.default.hash(input.newPassword, SALT_ROUNDS);
        return users_repository_1.usersRepository.updatePassword(id, passwordHash);
    },
};
//# sourceMappingURL=users.service.js.map