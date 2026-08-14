import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Rode com: npx tsx prisma/seed.ts
// Cria o primeiro usuário ADMIN, necessário para logar e gerenciar os demais.
async function main() {
  const email = "admin@clinica.com";
  const password = "admin123"; // troque depois do primeiro login

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log("Admin já existe:", email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Administrador",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin criado com sucesso:");
  console.log("Email:", admin.email);
  console.log("Senha:", password, "(troque assim que possível)");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
