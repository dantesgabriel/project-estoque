import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { AppError } from "../../shared/errors/AppError";
import { usersRepository } from "../users/users.repository";
import { LoginInput } from "./auth.schema";

export const authService = {
  async login(input: LoginInput) {
    const user = await usersRepository.findByEmail(input.email);

    // Mensagem genérica de propósito — não revela se o email existe ou não.
    if (!user || !user.active) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const signOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || "8h") as SignOptions["expiresIn"],
    };

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      signOptions
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
};
