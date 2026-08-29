-- Cadastro clínico: tutores, pets e atendimentos integrados ao estoque.
CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ');
CREATE TYPE "AppointmentStatus" AS ENUM ('COMPLETED', 'CANCELLED');

CREATE TABLE "tutors" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "documentType" "DocumentType" NOT NULL,
  "document" TEXT NOT NULL,
  "rg" TEXT,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "street" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "complement" TEXT,
  "neighborhood" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "zipCode" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "tutors_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pets" (
  "id" TEXT NOT NULL,
  "tutorId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "species" TEXT NOT NULL,
  "breed" TEXT,
  "birthDate" TIMESTAMP(3),
  "approximateAge" TEXT,
  "notes" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "appointments" (
  "id" TEXT NOT NULL,
  "tutorId" TEXT NOT NULL,
  "petId" TEXT NOT NULL,
  "responsibleId" TEXT NOT NULL,
  "createdById" TEXT NOT NULL,
  "attendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reason" TEXT NOT NULL,
  "notes" TEXT,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'COMPLETED',
  "cancelledAt" TIMESTAMP(3),
  "cancelReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "appointment_items" (
  "id" TEXT NOT NULL,
  "appointmentId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "stockMovementId" TEXT NOT NULL,
  "productName" TEXT NOT NULL,
  "productSku" TEXT NOT NULL,
  "unit" TEXT NOT NULL,
  CONSTRAINT "appointment_items_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "stock_movements" ADD COLUMN "appointmentId" TEXT;

CREATE UNIQUE INDEX "tutors_document_key" ON "tutors"("document");
CREATE INDEX "tutors_name_idx" ON "tutors"("name");
CREATE INDEX "tutors_active_idx" ON "tutors"("active");
CREATE INDEX "pets_tutorId_idx" ON "pets"("tutorId");
CREATE INDEX "pets_active_idx" ON "pets"("active");
CREATE INDEX "appointments_tutorId_attendedAt_idx" ON "appointments"("tutorId", "attendedAt");
CREATE INDEX "appointments_petId_attendedAt_idx" ON "appointments"("petId", "attendedAt");
CREATE INDEX "appointments_responsibleId_idx" ON "appointments"("responsibleId");
CREATE UNIQUE INDEX "appointment_items_stockMovementId_key" ON "appointment_items"("stockMovementId");
CREATE INDEX "appointment_items_appointmentId_idx" ON "appointment_items"("appointmentId");
CREATE INDEX "appointment_items_productId_idx" ON "appointment_items"("productId");
CREATE INDEX "stock_movements_appointmentId_idx" ON "stock_movements"("appointmentId");

ALTER TABLE "pets" ADD CONSTRAINT "pets_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_stockMovementId_fkey" FOREIGN KEY ("stockMovementId") REFERENCES "stock_movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
