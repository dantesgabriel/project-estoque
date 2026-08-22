import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  role: z.enum(["ADMIN", "FUNCIONARIO"]).default("FUNCIONARIO"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["ADMIN", "FUNCIONARIO"]).optional(),
  active: z.boolean().optional(),
});

// Admin redefinindo a senha de outro usuário (não precisa da senha atual).
export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

// Usuário trocando a própria senha (precisa confirmar a atual, por segurança).
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual obrigatória"),
  newPassword: z.string().min(6, "Nova senha deve ter ao menos 6 caracteres"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
