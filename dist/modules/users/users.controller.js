"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const users_service_1 = require("./users.service");
const users_schema_1 = require("./users.schema");
exports.usersController = {
    async create(req, res) {
        const input = users_schema_1.createUserSchema.parse(req.body);
        const user = await users_service_1.usersService.create(input);
        return res.status(201).json(user);
    },
    async list(_req, res) {
        const users = await users_service_1.usersService.list();
        return res.json(users);
    },
    async getById(req, res) {
        const user = await users_service_1.usersService.getById(req.params.id);
        return res.json(user);
    },
    async update(req, res) {
        const input = users_schema_1.updateUserSchema.parse(req.body);
        const user = await users_service_1.usersService.update(req.params.id, input);
        return res.json(user);
    },
    async resetPassword(req, res) {
        const input = users_schema_1.resetPasswordSchema.parse(req.body);
        const user = await users_service_1.usersService.resetPassword(req.params.id, input);
        return res.json(user);
    },
};
//# sourceMappingURL=users.controller.js.map