"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const auth_schema_1 = require("./auth.schema");
const users_service_1 = require("../users/users.service");
const users_schema_1 = require("../users/users.schema");
exports.authController = {
    async login(req, res) {
        const input = auth_schema_1.loginSchema.parse(req.body);
        const result = await auth_service_1.authService.login(input);
        return res.json(result);
    },
    async changePassword(req, res) {
        const input = users_schema_1.changePasswordSchema.parse(req.body);
        await users_service_1.usersService.changeOwnPassword(req.user.id, input);
        return res.status(204).send();
    },
};
//# sourceMappingURL=auth.controller.js.map