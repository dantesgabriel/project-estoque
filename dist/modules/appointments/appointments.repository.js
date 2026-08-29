"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsRepository = void 0;
const prisma_1 = require("../../config/prisma");
const appointmentInclude = {
    tutor: { select: { id: true, name: true, document: true, phone: true, email: true } },
    pet: { select: { id: true, name: true, species: true, breed: true } },
    responsible: { select: { id: true, name: true } },
    createdBy: { select: { id: true, name: true } },
    items: {
        include: {
            stockMovement: { include: { batch: { select: { id: true, batchNumber: true, expirationDate: true } } } },
        },
        orderBy: { productName: "asc" },
    },
};
exports.appointmentsRepository = {
    listResponsibleUsers() {
        return prisma_1.prisma.user.findMany({
            where: { active: true },
            select: { id: true, name: true, role: true },
            orderBy: { name: "asc" },
        });
    },
    list(filters) {
        return prisma_1.prisma.appointment.findMany({
            where: {
                ...(filters.tutorId && { tutorId: filters.tutorId }),
                ...(filters.petId && { petId: filters.petId }),
                ...((filters.from || filters.to) && { attendedAt: { ...(filters.from && { gte: filters.from }), ...(filters.to && { lte: filters.to }) } }),
            },
            include: appointmentInclude,
            orderBy: { attendedAt: "desc" },
        });
    },
    findById(id) {
        return prisma_1.prisma.appointment.findUnique({ where: { id }, include: appointmentInclude });
    },
    tutorHistory(tutorId) {
        return prisma_1.prisma.tutor.findUnique({
            where: { id: tutorId },
            include: {
                pets: { orderBy: { name: "asc" } },
                appointments: { include: appointmentInclude, orderBy: { attendedAt: "desc" } },
            },
        });
    },
};
//# sourceMappingURL=appointments.repository.js.map