-- Cadastro de fornecedores. O campo textual supplier continua preservado
-- nas movimentações antigas; novas movimentações podem usar supplierId.
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "suppliers_name_key" ON "suppliers"("name");
CREATE UNIQUE INDEX "suppliers_document_key" ON "suppliers"("document");
CREATE INDEX "suppliers_active_idx" ON "suppliers"("active");

ALTER TABLE "stock_movements" ADD COLUMN "supplierId" TEXT;
CREATE INDEX "stock_movements_supplierId_idx" ON "stock_movements"("supplierId");
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_supplierId_fkey"
  FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
