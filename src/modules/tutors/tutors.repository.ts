import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { CreatePetInput, CreateTutorInput, UpdatePetInput, UpdateTutorInput } from "./tutors.schema";

const tutorDetailInclude = {
  pets: { orderBy: { name: "asc" as const } },
} satisfies Prisma.TutorInclude;

export const tutorsRepository = {
  list(search?: string) {
    return prisma.tutor.findMany({
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
  findById(id: string) {
    return prisma.tutor.findUnique({ where: { id }, include: tutorDetailInclude });
  },
  findByDocument(document: string) {
    return prisma.tutor.findUnique({ where: { document } });
  },
  create(data: CreateTutorInput & { document: string }) {
    return prisma.tutor.create({ data, include: tutorDetailInclude });
  },
  update(id: string, data: UpdateTutorInput & { document?: string }) {
    return prisma.tutor.update({ where: { id }, data, include: tutorDetailInclude });
  },
  createPet(tutorId: string, data: CreatePetInput) {
    return prisma.pet.create({ data: { ...data, tutorId } });
  },
  findPetById(id: string) {
    return prisma.pet.findUnique({ where: { id } });
  },
  updatePet(id: string, data: UpdatePetInput) {
    return prisma.pet.update({ where: { id }, data });
  },
};
