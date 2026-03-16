// Lê as variáveis do ficheiro .env
require("dotenv").config({ path: "./.env" });

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// DEBUG – verificar se as variáveis de ambiente existem
console.log("DATABASE_URL existe?", process.env.DATABASE_URL ? "SIM" : "NAO");
console.log("JWT_SECRET existe?", process.env.JWT_SECRET ? "SIM" : "NAO");

// Adaptador para ligar o Prisma ao PostgreSQL
const adaptador = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

// Cliente Prisma
const prisma = new PrismaClient({
  adapter: adaptador
});

module.exports = prisma;