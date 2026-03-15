const prisma = require("../prisma/prismaClient");

// Lista todos os autores
const listarAutores = async () => {
  return prisma.author.findMany({
    orderBy: { name: "asc" }
  });
};

// Procura autor pelo id
const procurarAutorPorId = async (id) => {
  return prisma.author.findUnique({
    where: { id },
    include: { books: true }
  });
};

// Criar autor
const criarAutor = async (dados) => {
  return prisma.author.create({
    data: {
      name: dados.name,
      nationality: dados.nationality || null,
      birthYear: dados.birthYear || null
    }
  });
};

// Atualizar autor
const atualizarAutor = async (id, dados) => {

  const autor = await prisma.author.findUnique({
    where: { id }
  });

  if (!autor){
    return null;
  }

  return prisma.author.update({
    where: { id },
    data: dados
  });
};

// Apagar autor
const apagarAutor = async (id) => {

  const autor = await prisma.author.findUnique({
    where: { id },
    include: { books: true }
  });

  if (!autor){
    return "NAO_ENCONTRADO";
  }

  if (autor.books.length > 0){
    return "TEM_LIVROS";
  }

  await prisma.author.delete({
    where: { id }
  });

  return true;
};

// Listar livros de um autor
const listarLivrosDoAutor = async (id) => {

  const autor = await prisma.author.findUnique({
    where: { id },
    include: { books: true }
  });

  if (!autor){
    return "NAO_ENCONTRADO";
  }

  return autor.books;
};

// Autores com mais livros
const listarTopAutores = async () => {
  return prisma.author.findMany({
    include: {
      _count: { select: { books: true } }
    },
    orderBy: {
      books: { _count: "desc" }
    }
  });
};

module.exports = {
  listarAutores,
  procurarAutorPorId,
  criarAutor,
  atualizarAutor,
  apagarAutor,
  listarLivrosDoAutor,
  listarTopAutores
};