const prisma = require("../prisma/prismaClient");

// Lista livros com paginação
const listarLivros = async (query) => {

  const pagina = parseInt(query.page) || 1;
  const limite = parseInt(query.limit) || 10;

  const ordenar = query.sort === "year" ? "year" : "title";

  return prisma.book.findMany({
    skip: (pagina - 1) * limite,
    take: limite,
    orderBy: { [ordenar]: "asc" },
    include: { author: true }
  });
};

// Procurar livro por id
const procurarLivroPorId = async (id) => {
  return prisma.book.findUnique({
    where: { id },
    include: { author: true }
  });
};

// Criar livro
const criarLivro = async (dados) => {

  const autor = await prisma.author.findUnique({
    where: { id: dados.authorId }
  });

  if (!autor){
    return "AUTOR_NAO_ENCONTRADO";
  }

  return prisma.book.create({
    data: {
      title: dados.title,
      year: dados.year,
      genre: dados.genre,
      available: dados.available ?? true,
      authorId: dados.authorId
    },
    include: { author: true }
  });
};

// Atualizar livro
const atualizarLivro = async (id, dados) => {

  const livro = await prisma.book.findUnique({
    where: { id }
  });

  if (!livro){
    return "NAO_ENCONTRADO";
  }

  return prisma.book.update({
    where: { id },
    data: dados,
    include: { author: true }
  });
};

// Apagar livro
const apagarLivro = async (id) => {

  const livro = await prisma.book.findUnique({
    where: { id }
  });

  if (!livro){
    return "NAO_ENCONTRADO";
  }

  await prisma.book.delete({
    where: { id }
  });

  return true;
};

// Pesquisar livros
const pesquisarLivros = async (titulo) => {

  return prisma.book.findMany({
    where: {
      title: {
        contains: titulo,
        mode: "insensitive"
      }
    },
    include: { author: true },
    orderBy: { title: "asc" }
  });
};

module.exports = {
  listarLivros,
  procurarLivroPorId,
  criarLivro,
  atualizarLivro,
  apagarLivro,
  pesquisarLivros
};