import { describe, expect, it, vi, beforeEach, beforeAll } from "vitest";
import bcrypt from "bcryptjs";

vi.mock("../../users/users.repository", () => ({
  usersRepository: { findByEmail: vi.fn() },
}));

import { usersRepository } from "../../users/users.repository";
import { authService } from "../auth.service";

describe("authService.login", () => {
  beforeAll(() => {
    // jwt.sign precisa dessas variáveis — usamos valores de teste, não os reais.
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("rejeita com mensagem genérica quando o email não existe (sem revelar isso ao cliente)", async () => {
    vi.mocked(usersRepository.findByEmail).mockResolvedValue(null);

    await expect(authService.login({ email: "naoexiste@x.com", password: "qualquer" })).rejects.toThrow(
      "Credenciais inválidas"
    );
  });

  it("rejeita com a mesma mensagem genérica quando o usuário está inativo", async () => {
    const passwordHash = await bcrypt.hash("senha123", 10);
    vi.mocked(usersRepository.findByEmail).mockResolvedValue({
      id: "user-1",
      email: "inativo@x.com",
      passwordHash,
      active: false,
      role: "FUNCIONARIO",
    } as never);

    await expect(
      authService.login({ email: "inativo@x.com", password: "senha123" })
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("rejeita quando a senha está incorreta", async () => {
    const passwordHash = await bcrypt.hash("senhacorreta", 10);
    vi.mocked(usersRepository.findByEmail).mockResolvedValue({
      id: "user-1",
      email: "user@x.com",
      passwordHash,
      active: true,
      role: "FUNCIONARIO",
    } as never);

    await expect(
      authService.login({ email: "user@x.com", password: "senhaerrada" })
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("autentica com sucesso e retorna token quando as credenciais estão corretas", async () => {
    const passwordHash = await bcrypt.hash("senhacorreta", 10);
    vi.mocked(usersRepository.findByEmail).mockResolvedValue({
      id: "user-1",
      name: "Fulano",
      email: "user@x.com",
      passwordHash,
      active: true,
      role: "ADMIN",
    } as never);

    const result = await authService.login({ email: "user@x.com", password: "senhacorreta" });

    expect(result.token).toBeTypeOf("string");
    expect(result.user).toEqual({
      id: "user-1",
      name: "Fulano",
      email: "user@x.com",
      role: "ADMIN",
    });
    // Garante que o hash da senha nunca vaza na resposta.
    expect(result.user).not.toHaveProperty("passwordHash");
  });
});
