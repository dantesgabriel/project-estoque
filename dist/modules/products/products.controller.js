"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = void 0;
const products_service_1 = require("./products.service");
const products_schema_1 = require("./products.schema");
exports.productsController = {
    async list(req, res) {
        const filters = products_schema_1.listProductsQuerySchema.parse(req.query);
        const products = await products_service_1.productsService.list(filters);
        return res.json(products);
    },
    async getById(req, res) {
        const product = await products_service_1.productsService.getById(req.params.id);
        return res.json(product);
    },
    async create(req, res) {
        const input = products_schema_1.createProductSchema.parse(req.body);
        const product = await products_service_1.productsService.create(input);
        return res.status(201).json(product);
    },
    async update(req, res) {
        const input = products_schema_1.updateProductSchema.parse(req.body);
        const product = await products_service_1.productsService.update(req.params.id, input);
        return res.json(product);
    },
};
//# sourceMappingURL=products.controller.js.map