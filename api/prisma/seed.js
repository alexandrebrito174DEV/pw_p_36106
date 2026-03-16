const prisma = require("./prismaClient");

async function main() {
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();

  const autor1 = await prisma.author.create({
    data: {
      name: "Alexandre Silva",
      nationality: "Portuguesa",
      birthYear: 1990
    }
  });

  const autor2 = await prisma.author.create({
    data: {
      name: "Bruno Costa",
      nationality: "Portuguesa",
      birthYear: 1988
    }
  });

  const autor3 = await prisma.author.create({
    data: {
      name: "Carla Mendes",
      nationality: "Portuguesa",
      birthYear: 1995
    }
  });

  const autor4 = await prisma.author.create({
    data: {
      name: "Diana Rocha",
      nationality: "Portuguesa",
      birthYear: 1992
    }
  });

  const autor5 = await prisma.author.create({
    data: {
      name: "Eduardo Martins",
      nationality: "Portuguesa",
      birthYear: 1985
    }
  });

  await prisma.book.createMany({
    data: [
      { title: "Programação Fácil", year: 2020, genre: "programacao", available: true, authorId: autor1.id },
      
      { title: "Bases de Dados 1", year: 2021, genre: "tecnico", available: true, authorId: autor1.id },
      
      { title: "Redes para Todos", year: 2019, genre: "tecnico", available: false, authorId: autor1.id },

      { title: "Caminho Digital", year: 2018, genre: "tecnologia", available: true, authorId: autor2.id },
      
      { title: "Mundo Web", year: 2022, genre: "programacao", available: true, authorId: autor2.id },
      
      { title: "Introdução ao Código", year: 2017, genre: "tecnico", available: false, authorId: autor2.id },

      { title: "Lógica Moderna", year: 2023, genre: "educacao", available: true, authorId: autor3.id },
      
      { title: "Aprender API", year: 2021, genre: "programacao", available: true, authorId: autor3.id },
      
      { title: "Servidor Simples", year: 2020, genre: "tecnologia", available: false, authorId: autor3.id },

      { title: "Projeto Final", year: 2024, genre: "academico", available: true, authorId: autor4.id },
      
      { title: "Código Limpo", year: 2022, genre: "programacao", available: true, authorId: autor4.id },
      
      { title: "Estruturas Web", year: 2019, genre: "tecnico", available: false, authorId: autor4.id },

      { title: "Sistemas em Ação", year: 2016, genre: "sistemas", available: true, authorId: autor5.id },
      
      { title: "Biblioteca Inteligente", year: 2023, genre: "academico", available: true, authorId: autor5.id },
      
      { title: "Desenvolvimento Prático", year: 2021, genre: "programacao", available: false, authorId: autor5.id }
    ]
  });

  console.log("Seed executado com sucesso.");
}

main()
  .catch((erro) => {
    console.error("Erro ao executar seed:", erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Fecha a ligação à base de dados (Prisma) 
  });