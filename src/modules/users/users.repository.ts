import { prisma } from "../../config/prisma";
import { CreateUserInput, UpdateUserInput } from "./users.schema";

// Seleção padrão que nunca inclui passwordHash — evita vazar hash em qualquer resposta.
const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const usersRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: safeUserSelect });
  },

  // Usado apenas para trocar a própria senha — precisa comparar a senha atual.
  findByIdWithPassword(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  list() {
    return prisma.user.findMany({ select: safeUserSelect, orderBy: { name: "asc" } });
  },

  create(data: CreateUserInput & { passwordHash: string }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
      },
      select: safeUserSelect,
    });
  },

  update(id: string, data: UpdateUserInput) {
    return prisma.user.update({ where: { id }, data, select: safeUserSelect });
  },

  updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({ where: { id }, data: { passwordHash }, select: safeUserSelect });
  },
};
