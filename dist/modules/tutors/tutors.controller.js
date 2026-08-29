"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorsController = void 0;
const tutors_schema_1 = require("./tutors.schema");
const tutors_service_1 = require("./tutors.service");
exports.tutorsController = {
    async list(req, res) { return res.json(await tutors_service_1.tutorsService.list(tutors_schema_1.tutorListQuerySchema.parse(req.query).search)); },
    async getById(req, res) { return res.json(await tutors_service_1.tutorsService.getById(req.params.id)); },
    async create(req, res) { return res.status(201).json(await tutors_service_1.tutorsService.create(tutors_schema_1.createTutorSchema.parse(req.body))); },
    async update(req, res) { return res.json(await tutors_service_1.tutorsService.update(req.params.id, tutors_schema_1.updateTutorSchema.parse(req.body))); },
    async createPet(req, res) { return res.status(201).json(await tutors_service_1.tutorsService.createPet(req.params.id, tutors_schema_1.createPetSchema.parse(req.body))); },
    async getPet(req, res) { return res.json(await tutors_service_1.tutorsService.getPetById(req.params.id)); },
    async updatePet(req, res) { return res.json(await tutors_service_1.tutorsService.updatePet(req.params.id, tutors_schema_1.updatePetSchema.parse(req.body))); },
};
//# sourceMappingURL=tutors.controller.js.map