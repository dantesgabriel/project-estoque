"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../../shared/errors/AppError");
const appointments_repository_1 = require("./appointments.repository");
exports.appointmentsService = {
    listResponsibleUsers() { return appointments_repository_1.appointmentsRepository.listResponsibleUsers(); },
    list(filters) {
        return appointments_repository_1.appointmentsRepository.list(filters);
    },
    async getById(id) {
        const appointment = await appointments_repository_1.appointmentsRepository.findById(id);
        if (!appointment)
            throw new AppError_1.AppError("Atendimento não encontrado", 404);
        return appointment;
    },
    async tutorHistory(tutorId) {
        const history = await appointments_repository_1.appointmentsRepository.tutorHistory(tutorId);
        if (!history)
            throw new AppError_1.AppError("Tutor não encontrado", 404);
        return history;
    },
    async create(input, createdById) {
        try {
            return await prisma_1.prisma.$transaction(async (tx) => {
                const [tutor, pet, responsible] = await Promise.all([
                    tx.tutor.findUnique({ where: { id: input.tutorId } }),
                    tx.pet.findUnique({ where: { id: input.petId } }),
                    tx.user.findUnique({ where: { id: input.responsibleId } }),
                ]);
                if (!tutor || !tutor.active)
                    throw new AppError_1.AppError("Tutor não encontrado ou inativo", 404);
                if (!pet || !pet.active)
                    throw new AppError_1.AppError("Pet não encontrado ou inativo", 404);
                if (pet.tutorId !== tutor.id)
                    throw new AppError_1.AppError("O pet selecionado não pertence a este tutor", 400);
                if (!responsible || !responsible.active)
                    throw new AppError_1.AppError("Responsável não encontrado ou inativo", 404);
                const appointment = await tx.appointment.create({
                    data: {
                        tutorId: input.tutorId,
                        petId: input.petId,
                        responsibleId: input.responsibleId,
                        createdById,
                        attendedAt: input.attendedAt ?? new Date(),
                        reason: input.reason,
                        notes: input.notes || undefined,
                    },
                });
                for (const item of input.items) {
                    const product = await tx.product.findUnique({ where: { id: item.productId } });
                    if (!product || !product.active)
                        throw new AppError_1.AppError("Produto não encontrado ou inativo", 404);
                    if (product.currentStock < item.quantity) {
                        throw new AppError_1.AppError(`Estoque insuficiente para ${product.name}`, 409);
                    }
                    if (product.tracksBatch && !item.batchId) {
                        throw new AppError_1.AppError(`Selecione o lote utilizado para ${product.name}`, 400);
                    }
                    let batchId;
                    if (item.batchId) {
                        const batch = await tx.batch.findUnique({ where: { id: item.batchId } });
                        if (!batch || batch.productId !== product.id)
                            throw new AppError_1.AppError(`Lote inválido para ${product.name}`, 400);
                        if (batch.quantity < item.quantity)
                            throw new AppError_1.AppError(`Saldo insuficiente no lote selecionado de ${product.name}`, 409);
                        await tx.batch.update({ where: { id: batch.id }, data: { quantity: { decrement: item.quantity } } });
                        batchId = batch.id;
                    }
                    await tx.product.update({ where: { id: product.id }, data: { currentStock: { decrement: item.quantity } } });
                    const movement = await tx.stockMovement.create({
                        data: {
                            productId: product.id,
                            type: "OUT",
                            quantity: item.quantity,
                            reason: "ATENDIMENTO",
                            userId: createdById,
                            note: `Consumo no atendimento ${appointment.id}`,
                            batchId,
                            appointmentId: appointment.id,
                        },
                    });
                    await tx.appointmentItem.create({
                        data: {
                            appointmentId: appointment.id,
                            productId: product.id,
                            quantity: item.quantity,
                            stockMovementId: movement.id,
                            productName: product.name,
                            productSku: product.sku,
                            unit: product.unit,
                        },
                    });
                    await tx.auditLog.create({
                        data: {
                            entityType: "StockMovement",
                            entityId: movement.id,
                            action: "STOCK_OUT",
                            userId: createdById,
                            changes: { appointmentId: appointment.id, productId: product.id, quantity: item.quantity, previousStock: product.currentStock, newStock: product.currentStock - item.quantity },
                        },
                    });
                }
                await tx.auditLog.create({
                    data: {
                        entityType: "Appointment",
                        entityId: appointment.id,
                        action: "CREATE",
                        userId: createdById,
                        changes: { tutorId: appointment.tutorId, petId: appointment.petId, responsibleId: appointment.responsibleId, itemCount: input.items.length },
                    },
                });
                return appointment;
            }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
                throw new AppError_1.AppError("O estoque foi atualizado simultaneamente. Tente registrar o atendimento novamente.", 409);
            }
            throw error;
        }
    },
    async cancel(id, reason, userId) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const appointment = await tx.appointment.findUnique({
                where: { id },
                include: { items: { include: { stockMovement: true } } },
            });
            if (!appointment)
                throw new AppError_1.AppError("Atendimento não encontrado", 404);
            if (appointment.status === "CANCELLED")
                throw new AppError_1.AppError("Este atendimento já foi cancelado", 400);
            for (const item of appointment.items) {
                await tx.product.update({ where: { id: item.productId }, data: { currentStock: { increment: item.quantity } } });
                if (item.stockMovement.batchId) {
                    await tx.batch.update({ where: { id: item.stockMovement.batchId }, data: { quantity: { increment: item.quantity } } });
                }
                const reversal = await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        type: "IN",
                        quantity: item.quantity,
                        reason: "OUTRO",
                        userId,
                        batchId: item.stockMovement.batchId ?? undefined,
                        appointmentId: appointment.id,
                        note: `Estorno do atendimento ${appointment.id}: ${reason}`,
                    },
                });
                await tx.auditLog.create({ data: { entityType: "StockMovement", entityId: reversal.id, action: "STOCK_IN", userId, changes: { appointmentId: appointment.id, reversalOf: item.stockMovementId, quantity: item.quantity } } });
            }
            const cancelled = await tx.appointment.update({ where: { id }, data: { status: "CANCELLED", cancelledAt: new Date(), cancelReason: reason } });
            await tx.auditLog.create({ data: { entityType: "Appointment", entityId: id, action: "UPDATE", userId, changes: { status: "CANCELLED", reason } } });
            return cancelled;
        }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
    },
};
//# sourceMappingURL=appointments.service.js.map