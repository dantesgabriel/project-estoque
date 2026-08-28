"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = void 0;
const prisma_1 = require("../../config/prisma");
// Seleção padrão que nunca inclui passwordHash — evita vazar hash em qualquer resposta.
const safeUserSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    active: true,
    createdAt: true,
    updatedAt: true,
};
exports.usersRepository = {
    findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    },
    findById(id) {
        return prisma_1.prisma.user.findUnique({ where: { id }, select: safeUserSelect });
    },
    // Usado apenas para trocar a própria senha — precisa comparar a senha atual.
    findByIdWithPassword(id) {
        return prisma_1.prisma.user.findUnique({ where: { id } });
    },
    list() {
        return prisma_1.prisma.user.findMany({ select: safeUserSelect, orderBy: { name: "asc" } });
    },
    create(data) {
        return prisma_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                role: data.role,
            },
            select: safeUserSelect,
        });
    },
    update(id, data) {
        return prisma_1.prisma.user.update({ where: { id }, data, select: safeUserSelect });
    },
    updatePassword(id, passwordHash) {
        return prisma_1.prisma.user.update({ where: { id }, data: { passwordHash }, select: safeUserSelect });
    },
};
//# sourceMappingURL=users.repository.js.map