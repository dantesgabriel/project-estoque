"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
vitest_1.vi.mock("../../users/users.repository", () => ({
    usersRepository: { findByEmail: vitest_1.vi.fn() },
}));
const users_repository_1 = require("../../users/users.repository");
const auth_service_1 = require("../auth.service");
(0, vitest_1.describe)("authService.login", () => {
    (0, vitest_1.beforeAll)(() => {
        // jwt.sign precisa dessas variáveis — usamos valores de teste, não os reais.
        process.env.JWT_SECRET = "test-secret";
        process.env.JWT_EXPIRES_IN = "1h";
    });
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.resetAllMocks();
    });
    (0, vitest_1.it)("rejeita com mensagem genérica quando o email não existe (sem revelar isso ao cliente)", async () => {
        vitest_1.vi.mocked(users_repository_1.usersRepository.findByEmail).mockResolvedValue(null);
        await (0, vitest_1.expect)(auth_service_1.authService.login({ email: "naoexiste@x.com", password: "qualquer" })).rejects.toThrow("Credenciais inválidas");
    });
    (0, vitest_1.it)("rejeita com a mesma mensagem genérica quando o usuário está inativo", async () => {
        const passwordHash = await bcryptjs_1.default.hash("senha123", 10);
        vitest_1.vi.mocked(users_repository_1.usersRepository.findByEmail).mockResolvedValue({
            id: "user-1",
            email: "inativo@x.com",
            passwordHash,
            active: false,
            role: "FUNCIONARIO",
        });
        await (0, vitest_1.expect)(auth_service_1.authService.login({ email: "inativo@x.com", password: "senha123" })).rejects.toThrow("Credenciais inválidas");
    });
    (0, vitest_1.it)("rejeita quando a senha está incorreta", async () => {
        const passwordHash = await bcryptjs_1.default.hash("senhacorreta", 10);
        vitest_1.vi.mocked(users_repository_1.usersRepository.findByEmail).mockResolvedValue({
            id: "user-1",
            email: "user@x.com",
            passwordHash,
            active: true,
            role: "FUNCIONARIO",
        });
        await (0, vitest_1.expect)(auth_service_1.authService.login({ email: "user@x.com", password: "senhaerrada" })).rejects.toThrow("Credenciais inválidas");
    });
    (0, vitest_1.it)("autentica com sucesso e retorna token quando as credenciais estão corretas", async () => {
        const passwordHash = await bcryptjs_1.default.hash("senhacorreta", 10);
        vitest_1.vi.mocked(users_repository_1.usersRepository.findByEmail).mockResolvedValue({
            id: "user-1",
            name: "Fulano",
            email: "user@x.com",
            passwordHash,
            active: true,
            role: "ADMIN",
        });
        const result = await auth_service_1.authService.login({ email: "user@x.com", password: "senhacorreta" });
        (0, vitest_1.expect)(result.token).toBeTypeOf("string");
        (0, vitest_1.expect)(result.user).toEqual({
            id: "user-1",
            name: "Fulano",
            email: "user@x.com",
            role: "ADMIN",
        });
        // Garante que o hash da senha nunca vaza na resposta.
        (0, vitest_1.expect)(result.user).not.toHaveProperty("passwordHash");
    });
});
//# sourceMappingURL=auth.service.test.js.map