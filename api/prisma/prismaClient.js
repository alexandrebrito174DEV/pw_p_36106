// Lê as variáveis do ficheiro .env
require("dotenv").config({ path: "./.env" });

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// Adaptador para ligar o Prisma ao PostgreSQL
const adaptador = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

// Cliente Prisma
const prisma = new PrismaClient({
  adapter: adaptador
});

module.exports = prisma;