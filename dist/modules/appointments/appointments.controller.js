"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsController = void 0;
const appointments_schema_1 = require("./appointments.schema");
const appointments_service_1 = require("./appointments.service");
exports.appointmentsController = {
    async listResponsibleUsers(_req, res) { return res.json(await appointments_service_1.appointmentsService.listResponsibleUsers()); },
    async list(req, res) { return res.json(await appointments_service_1.appointmentsService.list(appointments_schema_1.appointmentListQuerySchema.parse(req.query))); },
    async getById(req, res) { return res.json(await appointments_service_1.appointmentsService.getById(req.params.id)); },
    async tutorHistory(req, res) { return res.json(await appointments_service_1.appointmentsService.tutorHistory(req.params.id)); },
    async create(req, res) { return res.status(201).json(await appointments_service_1.appointmentsService.create(appointments_schema_1.createAppointmentSchema.parse(req.body), req.user.id)); },
    async cancel(req, res) { return res.json(await appointments_service_1.appointmentsService.cancel(req.params.id, appointments_schema_1.cancelAppointmentSchema.parse(req.body).reason, req.user.id)); },
};
//# sourceMappingURL=appointments.controller.js.map