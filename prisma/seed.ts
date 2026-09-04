import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@paginasamarelas.local" },
    update: {},
    create: {
      email: "admin@paginasamarelas.local",
      name: "Administrador",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Seed concluído: admin@paginasamarelas.local / admin123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
