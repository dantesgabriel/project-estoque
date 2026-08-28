"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../shared/errors/AppError");
const users_repository_1 = require("../users/users.repository");
exports.authService = {
    async login(input) {
        const user = await users_repository_1.usersRepository.findByEmail(input.email);
        // Mensagem genérica de propósito — não revela se o email existe ou não.
        if (!user || !user.active) {
            throw new AppError_1.AppError("Credenciais inválidas", 401);
        }
        const passwordMatches = await bcryptjs_1.default.compare(input.password, user.passwordHash);
        if (!passwordMatches) {
            throw new AppError_1.AppError("Credenciais inválidas", 401);
        }
        const signOptions = {
            expiresIn: (process.env.JWT_EXPIRES_IN || "8h"),
        };
        const token = jsonwebtoken_1.default.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, signOptions);
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
//# sourceMappingURL=auth.service.js.map