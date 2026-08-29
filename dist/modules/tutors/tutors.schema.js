"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorListQuerySchema = exports.updatePetSchema = exports.createPetSchema = exports.updateTutorSchema = exports.createTutorSchema = void 0;
const zod_1 = require("zod");
const documentTypeSchema = zod_1.z.enum(["CPF", "CNPJ"]);
const requiredText = (label) => zod_1.z.string().trim().min(1, `${label} é obrigatório`);
exports.createTutorSchema = zod_1.z.object({
    name: requiredText("Nome"),
    documentType: documentTypeSchema,
    document: requiredText("Documento"),
    rg: zod_1.z.string().trim().optional(),
    phone: requiredText("Telefone"),
    email: zod_1.z.string().trim().email("E-mail inválido"),
    street: requiredText("Rua"),
    number: requiredText("Número"),
    complement: zod_1.z.string().trim().optional(),
    neighborhood: requiredText("Bairro"),
    city: requiredText("Cidade"),
    state: zod_1.z.string().trim().length(2, "Informe a UF com 2 letras").transform((value) => value.toUpperCase()),
    zipCode: requiredText("CEP"),
});
exports.updateTutorSchema = exports.createTutorSchema.partial().extend({
    active: zod_1.z.boolean().optional(),
});
exports.createPetSchema = zod_1.z.object({
    name: requiredText("Nome"),
    species: zod_1.z.enum(["CAO", "GATO", "AVE", "ROEDOR", "REPTIL", "OUTRO"]),
    breed: zod_1.z.string().trim().optional(),
    birthDate: zod_1.z.coerce.date().optional(),
    approximateAge: zod_1.z.string().trim().optional(),
    notes: zod_1.z.string().trim().optional(),
});
exports.updatePetSchema = exports.createPetSchema.partial().extend({
    active: zod_1.z.boolean().optional(),
});
exports.tutorListQuerySchema = zod_1.z.object({
    search: zod_1.z.string().trim().optional(),
});
//# sourceMappingURL=tutors.schema.js.map