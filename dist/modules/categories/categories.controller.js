"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesController = void 0;
const categories_service_1 = require("./categories.service");
const categories_schema_1 = require("./categories.schema");
exports.categoriesController = {
    async list(_req, res) {
        const categories = await categories_service_1.categoriesService.list();
        return res.json(categories);
    },
    async getById(req, res) {
        const category = await categories_service_1.categoriesService.getById(req.params.id);
        return res.json(category);
    },
    async create(req, res) {
        const input = categories_schema_1.createCategorySchema.parse(req.body);
        const category = await categories_service_1.categoriesService.create(input);
        return res.status(201).json(category);
    },
    async update(req, res) {
        const input = categories_schema_1.updateCategorySchema.parse(req.body);
        const category = await categories_service_1.categoriesService.update(req.params.id, input);
        return res.json(category);
    },
    async delete(req, res) {
        await categories_service_1.categoriesService.delete(req.params.id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=categories.controller.js.map