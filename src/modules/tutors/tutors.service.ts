import { AppError } from "../../shared/errors/AppError";
import { CreatePetInput, CreateTutorInput, UpdatePetInput, UpdateTutorInput } from "./tutors.schema";
import { tutorsRepository } from "./tutors.repository";

function normalizeDocument(document: string) {
  return document.replace(/\D/g, "");
}

function validateDocument(documentType: "CPF" | "CNPJ", document: string) {
  const expectedLength = documentType === "CPF" ? 11 : 14;
  if (document.length !== expectedLength) {
    throw new AppError(`${documentType} deve conter ${expectedLength} dígitos`, 400);
  }
}

export const tutorsService = {
  list(search?: string) { return tutorsRepository.list(search); },
  async getById(id: string) {
    const tutor = await tutorsRepository.findById(id);
    if (!tutor) throw new AppError("Tutor não encontrado", 404);
    return tutor;
  },
  async create(input: CreateTutorInput) {
    const document = normalizeDocument(input.document);
    validateDocument(input.documentType, document);
    if (await tutorsRepository.findByDocument(document)) {
      throw new AppError("Já existe um tutor com este CPF/CNPJ", 409);
    }
    return tutorsRepository.create({ ...input, document, rg: input.rg || undefined, complement: input.complement || undefined });
  },
  async update(id: string, input: UpdateTutorInput) {
    const current = await this.getById(id);
    const data: UpdateTutorInput & { document?: string } = { ...input };
    if (input.document) {
      const document = normalizeDocument(input.document);
      validateDocument(input.documentType ?? current.documentType, document);
      const existing = await tutorsRepository.findByDocument(document);
      if (existing && existing.id !== id) throw new AppError("Já existe um tutor com este CPF/CNPJ", 409);
      data.document = document;
    }
    return tutorsRepository.update(id, data);
  },
  async createPet(tutorId: string, input: CreatePetInput) {
    const tutor = await this.getById(tutorId);
    if (!tutor.active) throw new AppError("Não é possível cadastrar pet para tutor inativo", 400);
    return tutorsRepository.createPet(tutorId, input);
  },
  async updatePet(id: string, input: UpdatePetInput) {
    if (!await tutorsRepository.findPetById(id)) throw new AppError("Pet não encontrado", 404);
    return tutorsRepository.updatePet(id, input);
  },
  async getPetById(id: string) {
    const pet = await tutorsRepository.findPetById(id);
    if (!pet) throw new AppError("Pet não encontrado", 404);
    return pet;
  },
};
