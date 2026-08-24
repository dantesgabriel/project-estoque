import { describe, expect, it, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";

vi.mock("../users.repository", () => ({
  usersRepository: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    findByIdWithPassword: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updatePassword: vi.fn(),
    list: vi.fn(),
  },
}));

import { usersRepository } from "../users.repository";
import { usersService } from "../users.service";

describe("usersService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("create", () => {
    it("bloqueia cadastro com email já existente", async () => {
      vi.mocked(usersRepository.findByEmail).mockResolvedValue({ id: "user-1" } as never);

      await expect(
        usersService.create({
          name: "Novo",
          email: "existe@x.com",
          password: "123456",
          role: "FUNCIONARIO",
        })
      ).rejects.toThrow("Já existe um usuário com esse email");

      expect(usersRepository.create).not.toHaveBeenCalled();
    });

    it("cria o usuário com a senha em hash, nunca em texto puro", async () => {
      vi.mocked(usersRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(usersRepository.create).mockResolvedValue({ id: "user-1" } as never);

      await usersService.create({
        name: "Novo",
        email: "novo@x.com",
        password: "senha123",
        role: "FUNCIONARIO",
      });

      const callArg = vi.mocked(usersRepository.create).mock.calls[0][0];
      expect(callArg.passwordHash).not.toBe("senha123");
      expect(await bcrypt.compare("senha123", callArg.passwordHash)).toBe(true);
    });
  });

  describe("getById", () => {
    it("lança erro quando o usuário não existe", async () => {
      vi.mocked(usersRepository.findById).mockResolvedValue(null);

      await expect(usersService.getById("user-x")).rejects.toThrow("Usuário não encontrado");
    });
  });

  describe("changeOwnPassword", () => {
    it("bloqueia quando a senha atual está incorreta", async () => {
      const passwordHash = await bcrypt.hash("senhaatual", 10);
      vi.mocked(usersRepository.findByIdWithPassword).mockResolvedValue({
        id: "user-1",
        passwordHash,
      } as never);

      await expect(
        usersService.changeOwnPassword("user-1", {
          currentPassword: "senhaerrada",
          newPassword: "novasenha123",
        })
      ).rejects.toThrow("Senha atual incorreta");

      expect(usersRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("troca a senha com sucesso quando a senha atual está correta", async () => {
      const passwordHash = await bcrypt.hash("senhaatual", 10);
      vi.mocked(usersRepository.findByIdWithPassword).mockResolvedValue({
        id: "user-1",
        passwordHash,
      } as never);
      vi.mocked(usersRepository.updatePassword).mockResolvedValue({ id: "user-1" } as never);

      await usersService.changeOwnPassword("user-1", {
        currentPassword: "senhaatual",
        newPassword: "novasenha123",
      });

      const [, newHash] = vi.mocked(usersRepository.updatePassword).mock.calls[0];
      expect(await bcrypt.compare("novasenha123", newHash)).toBe(true);
    });
  });

  describe("resetPassword (admin)", () => {
    it("não exige senha atual — falha apenas se o usuário não existir", async () => {
      vi.mocked(usersRepository.findById).mockResolvedValue(null);

      await expect(
        usersService.resetPassword("user-x", { newPassword: "novasenha123" })
      ).rejects.toThrow("Usuário não encontrado");
    });

    it("redefine a senha com sucesso quando o usuário existe", async () => {
      vi.mocked(usersRepository.findById).mockResolvedValue({ id: "user-1" } as never);
      vi.mocked(usersRepository.updatePassword).mockResolvedValue({ id: "user-1" } as never);

      await usersService.resetPassword("user-1", { newPassword: "novasenha123" });

      expect(usersRepository.updatePassword).toHaveBeenCalledWith(
        "user-1",
        expect.any(String)
      );
    });
  });
});
