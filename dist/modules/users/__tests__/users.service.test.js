"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
vitest_1.vi.mock("../users.repository", () => ({
    usersRepository: {
        findByEmail: vitest_1.vi.fn(),
        findById: vitest_1.vi.fn(),
        findByIdWithPassword: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        updatePassword: vitest_1.vi.fn(),
        list: vitest_1.vi.fn(),
    },
}));
const users_repository_1 = require("../users.repository");
const users_service_1 = require("../users.service");
(0, vitest_1.describe)("usersService", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.resetAllMocks();
    });
    (0, vitest_1.describe)("create", () => {
        (0, vitest_1.it)("bloqueia cadastro com email já existente", async () => {
            vitest_1.vi.mocked(users_repository_1.usersRepository.findByEmail).mockResolvedValue({ id: "user-1" });
            await (0, vitest_1.expect)(users_service_1.usersService.create({
                name: "Novo",
                email: "existe@x.com",
                password: "123456",
                role: "FUNCIONARIO",
            })).rejects.toThrow("Já existe um usuário com esse email");
            (0, vitest_1.expect)(users_repository_1.usersRepository.create).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)("cria o usuário com a senha em hash, nunca em texto puro", async () => {
            vitest_1.vi.mocked(users_repository_1.usersRepository.findByEmail).mockResolvedValue(null);
            vitest_1.vi.mocked(users_repository_1.usersRepository.create).mockResolvedValue({ id: "user-1" });
            await users_service_1.usersService.create({
                name: "Novo",
                email: "novo@x.com",
                password: "senha123",
                role: "FUNCIONARIO",
            });
            const callArg = vitest_1.vi.mocked(users_repository_1.usersRepository.create).mock.calls[0][0];
            (0, vitest_1.expect)(callArg.passwordHash).not.toBe("senha123");
            (0, vitest_1.expect)(await bcryptjs_1.default.compare("senha123", callArg.passwordHash)).toBe(true);
        });
    });
    (0, vitest_1.describe)("getById", () => {
        (0, vitest_1.it)("lança erro quando o usuário não existe", async () => {
            vitest_1.vi.mocked(users_repository_1.usersRepository.findById).mockResolvedValue(null);
            await (0, vitest_1.expect)(users_service_1.usersService.getById("user-x")).rejects.toThrow("Usuário não encontrado");
        });
    });
    (0, vitest_1.describe)("changeOwnPassword", () => {
        (0, vitest_1.it)("bloqueia quando a senha atual está incorreta", async () => {
            const passwordHash = await bcryptjs_1.default.hash("senhaatual", 10);
            vitest_1.vi.mocked(users_repository_1.usersRepository.findByIdWithPassword).mockResolvedValue({
                id: "user-1",
                passwordHash,
            });
            await (0, vitest_1.expect)(users_service_1.usersService.changeOwnPassword("user-1", {
                currentPassword: "senhaerrada",
                newPassword: "novasenha123",
            })).rejects.toThrow("Senha atual incorreta");
            (0, vitest_1.expect)(users_repository_1.usersRepository.updatePassword).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)("troca a senha com sucesso quando a senha atual está correta", async () => {
            const passwordHash = await bcryptjs_1.default.hash("senhaatual", 10);
            vitest_1.vi.mocked(users_repository_1.usersRepository.findByIdWithPassword).mockResolvedValue({
                id: "user-1",
                passwordHash,
            });
            vitest_1.vi.mocked(users_repository_1.usersRepository.updatePassword).mockResolvedValue({ id: "user-1" });
            await users_service_1.usersService.changeOwnPassword("user-1", {
                currentPassword: "senhaatual",
                newPassword: "novasenha123",
            });
            const [, newHash] = vitest_1.vi.mocked(users_repository_1.usersRepository.updatePassword).mock.calls[0];
            (0, vitest_1.expect)(await bcryptjs_1.default.compare("novasenha123", newHash)).toBe(true);
        });
    });
    (0, vitest_1.describe)("resetPassword (admin)", () => {
        (0, vitest_1.it)("não exige senha atual — falha apenas se o usuário não existir", async () => {
            vitest_1.vi.mocked(users_repository_1.usersRepository.findById).mockResolvedValue(null);
            await (0, vitest_1.expect)(users_service_1.usersService.resetPassword("user-x", { newPassword: "novasenha123" })).rejects.toThrow("Usuário não encontrado");
        });
        (0, vitest_1.it)("redefine a senha com sucesso quando o usuário existe", async () => {
            vitest_1.vi.mocked(users_repository_1.usersRepository.findById).mockResolvedValue({ id: "user-1" });
            vitest_1.vi.mocked(users_repository_1.usersRepository.updatePassword).mockResolvedValue({ id: "user-1" });
            await users_service_1.usersService.resetPassword("user-1", { newPassword: "novasenha123" });
            (0, vitest_1.expect)(users_repository_1.usersRepository.updatePassword).toHaveBeenCalledWith("user-1", vitest_1.expect.any(String));
        });
    });
});
//# sourceMappingURL=users.service.test.js.map