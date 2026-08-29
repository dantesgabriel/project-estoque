"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorsRepository = void 0;
const prisma_1 = require("../../config/prisma");
const tutorDetailInclude = {
    pets: { orderBy: { name: "asc" } },
};
exports.tutorsRepository = {
    list(search) {
        return prisma_1.prisma.tutor.findMany({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { document: { contains: search.replace(/\D/g, "") } },
                    { phone: { contains: search } },
                ],
            } : undefined,
            include: { _count: { select: { pets: true, appointments: true } } },
            orderBy: { name: "asc" },
        });
    },
    findById(id) {
        return prisma_1.prisma.tutor.findUnique({ where: { id }, include: tutorDetailInclude });
    },
    findByDocument(document) {
        return prisma_1.prisma.tutor.findUnique({ where: { document } });
    },
    create(data) {
        return prisma_1.prisma.tutor.create({ data, include: tutorDetailInclude });
    },
    update(id, data) {
        return prisma_1.prisma.tutor.update({ where: { id }, data, include: tutorDetailInclude });
    },
    createPet(tutorId, data) {
        return prisma_1.prisma.pet.create({ data: { ...data, tutorId } });
    },
    findPetById(id) {
        return prisma_1.prisma.pet.findUnique({ where: { id } });
    },
    updatePet(id, data) {
        return prisma_1.prisma.pet.update({ where: { id }, data });
    },
};
//# sourceMappingURL=tutors.repository.js.map