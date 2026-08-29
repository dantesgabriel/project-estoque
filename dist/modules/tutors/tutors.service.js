"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorsService = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const tutors_repository_1 = require("./tutors.repository");
function normalizeDocument(document) {
    return document.replace(/\D/g, "");
}
function validateDocument(documentType, document) {
    const expectedLength = documentType === "CPF" ? 11 : 14;
    if (document.length !== expectedLength) {
        throw new AppError_1.AppError(`${documentType} deve conter ${expectedLength} dígitos`, 400);
    }
}
exports.tutorsService = {
    list(search) { return tutors_repository_1.tutorsRepository.list(search); },
    async getById(id) {
        const tutor = await tutors_repository_1.tutorsRepository.findById(id);
        if (!tutor)
            throw new AppError_1.AppError("Tutor não encontrado", 404);
        return tutor;
    },
    async create(input) {
        const document = normalizeDocument(input.document);
        validateDocument(input.documentType, document);
        if (await tutors_repository_1.tutorsRepository.findByDocument(document)) {
            throw new AppError_1.AppError("Já existe um tutor com este CPF/CNPJ", 409);
        }
        return tutors_repository_1.tutorsRepository.create({ ...input, document, rg: input.rg || undefined, complement: input.complement || undefined });
    },
    async update(id, input) {
        const current = await this.getById(id);
        const data = { ...input };
        if (input.document) {
            const document = normalizeDocument(input.document);
            validateDocument(input.documentType ?? current.documentType, document);
            const existing = await tutors_repository_1.tutorsRepository.findByDocument(document);
            if (existing && existing.id !== id)
                throw new AppError_1.AppError("Já existe um tutor com este CPF/CNPJ", 409);
            data.document = document;
        }
        return tutors_repository_1.tutorsRepository.update(id, data);
    },
    async createPet(tutorId, input) {
        const tutor = await this.getById(tutorId);
        if (!tutor.active)
            throw new AppError_1.AppError("Não é possível cadastrar pet para tutor inativo", 400);
        return tutors_repository_1.tutorsRepository.createPet(tutorId, input);
    },
    async updatePet(id, input) {
        if (!await tutors_repository_1.tutorsRepository.findPetById(id))
            throw new AppError_1.AppError("Pet não encontrado", 404);
        return tutors_repository_1.tutorsRepository.updatePet(id, input);
    },
    async getPetById(id) {
        const pet = await tutors_repository_1.tutorsRepository.findPetById(id);
        if (!pet)
            throw new AppError_1.AppError("Pet não encontrado", 404);
        return pet;
    },
};
//# sourceMappingURL=tutors.service.js.map