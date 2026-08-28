"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.resetPasswordSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Nome muito curto"),
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
    role: zod_1.z.enum(["ADMIN", "FUNCIONARIO"]).default("FUNCIONARIO"),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    role: zod_1.z.enum(["ADMIN", "FUNCIONARIO"]).optional(),
    active: zod_1.z.boolean().optional(),
});
// Admin redefinindo a senha de outro usuário (não precisa da senha atual).
exports.resetPasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});
// Usuário trocando a própria senha (precisa confirmar a atual, por segurança).
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "Senha atual obrigatória"),
    newPassword: zod_1.z.string().min(6, "Nova senha deve ter ao menos 6 caracteres"),
});
//# sourceMappingURL=users.schema.js.map