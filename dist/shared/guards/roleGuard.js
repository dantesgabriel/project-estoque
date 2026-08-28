"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = roleGuard;
const AppError_1 = require("../errors/AppError");
// Uso: router.post("/produtos", authGuard, roleGuard(["ADMIN"]), controller)
// Sempre usado DEPOIS do authGuard, pois depende de req.user já preenchido.
function roleGuard(allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            throw new AppError_1.AppError("Usuário não autenticado", 401);
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError_1.AppError("Você não tem permissão para essa ação", 403);
        }
        next();
    };
}
//# sourceMappingURL=roleGuard.js.map