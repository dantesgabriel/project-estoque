"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suppliersController = void 0;
const suppliers_service_1 = require("./suppliers.service");
const suppliers_schema_1 = require("./suppliers.schema");
exports.suppliersController = {
    async list(_req, res) { return res.json(await suppliers_service_1.suppliersService.list()); },
    async getById(req, res) { return res.json(await suppliers_service_1.suppliersService.getById(req.params.id)); },
    async create(req, res) { return res.status(201).json(await suppliers_service_1.suppliersService.create(suppliers_schema_1.createSupplierSchema.parse(req.body))); },
    async update(req, res) { return res.json(await suppliers_service_1.suppliersService.update(req.params.id, suppliers_schema_1.updateSupplierSchema.parse(req.body))); },
    async delete(req, res) { await suppliers_service_1.suppliersService.delete(req.params.id); return res.status(204).send(); },
};
//# sourceMappingURL=suppliers.controller.js.map