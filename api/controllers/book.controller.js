const bookService = require("../services/book.service");

const listarLivros = async (req, res, next) => {
  try{
    const livros = await bookService.listarLivros(req.query);
    return res.status(200).json(livros);
  }
  catch (erro){
    next(erro);
  }
};

const procurarLivroPorId = async (req, res, next) => {
  try{
    const { id } = req.params;
    const livro = await bookService.procurarLivroPorId(id);

    if (!livro){
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    return res.status(200).json(livro);
  }
  catch (erro){
    next(erro);
  }
};

const criarLivro = async (req, res, next) => {
  try{
    const { title, year, genre, available, authorId } = req.body;

    if (!title || year === undefined || !genre || !authorId){
      return res.status(400).json({ erro: "Os campos title, year, genre e authorId são obrigatórios." });
    }

    if (typeof year !== "number"){
      return res.status(400).json({ erro: "O campo year tem de ser numérico." });
    }

    const novoLivro = await bookService.criarLivro({
      title,
      year,
      genre,
      available,
      authorId
    });

    if (novoLivro === "AUTOR_NAO_ENCONTRADO"){
      return res.status(400).json({ erro: "O authorId indicado não existe." });
    }

    return res.status(201).json(novoLivro);
  }
  catch (erro){
    next(erro);
  }
};

const atualizarLivro = async (req, res, next) => {
  try{
    const { id } = req.params;
    const { title, year, genre, available, authorId } = req.body;

    if (!title || year === undefined || !genre || !authorId){
      return res.status(400).json({ erro: "Os campos title, year, genre e authorId são obrigatórios." });
    }

    if (typeof year !== "number"){
      return res.status(400).json({ erro: "O campo year tem de ser numérico." });
    }

    const livroAtualizado = await bookService.atualizarLivro(id, {
      title,
      year,
      genre,
      available,
      authorId
    });

    if (livroAtualizado === "NAO_ENCONTRADO"){
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    if (livroAtualizado === "AUTOR_NAO_ENCONTRADO"){
      return res.status(400).json({ erro: "O authorId indicado não existe." });
    }

    return res.status(200).json(livroAtualizado);
  }
  catch (erro){
    next(erro);
  }
};

const apagarLivro = async (req, res, next) => {
  try{
    const { id } = req.params;
    const resultado = await bookService.apagarLivro(id);

    if (resultado === "NAO_ENCONTRADO"){
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    return res.status(204).send();
  }
  catch (erro){
    next(erro);
  }
};

const pesquisarLivros = async (req, res, next) => {
  try{
    const { title } = req.query;

    if (!title){
      return res.status(400).json({ erro: "O parâmetro title é obrigatório." });
    }

    const livros = await bookService.pesquisarLivros(title);
    return res.status(200).json(livros);
  }
  catch (erro){
    next(erro);
  }
};

module.exports = {
  listarLivros,
  procurarLivroPorId,
  criarLivro,
  atualizarLivro,
  apagarLivro,
  pesquisarLivros
};