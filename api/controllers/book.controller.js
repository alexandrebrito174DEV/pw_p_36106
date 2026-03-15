const livroService = require("../services/book.service");

const listarLivros = async (req, res, next) => {
  try{
    const livros = await livroService.listarLivros(req.query);
    return res.status(200).json(livros);
  }
  catch (erro){
    next(erro);
  }
};

const procurarLivroPorId = async (req, res, next) => {
  try{
    const livro = await livroService.procurarLivroPorId(req.params.id);

    if (!livro){
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    return res.status(200).json(livro);
  }
  catch (erro){
    next(erro);
  }
};

const criarLivro = async (req, res, next) => {
  try{
    const titulo = req.body.title;
    const ano = req.body.year;
    const genero = req.body.genre;
    const disponivel = req.body.available;
    const autorId = req.body.authorId;

    if (!titulo || ano === undefined || !genero || !autorId){
      return res.status(400).json({
        erro: "Os campos title, year, genre e authorId são obrigatórios"
      });
    }

    if (isNaN(parseInt(ano))){
      return res.status(400).json({ erro: "O campo year tem de ser numérico" });
    }

    const resultado = await livroService.criarLivro({
      title: titulo,
      year: parseInt(ano),
      genre: genero,
      available: disponivel,
      authorId: autorId
    });

    if (resultado === "AUTOR_NAO_ENCONTRADO"){
      return res.status(400).json({ erro: "O autor indicado não existe" });
    }

    return res.status(201).json(resultado);
  }
  catch (erro){
    next(erro);
  }
};

const atualizarLivro = async (req, res, next) => {
  try{
    const titulo = req.body.title;
    const ano = req.body.year;
    const genero = req.body.genre;
    const disponivel = req.body.available;
    const autorId = req.body.authorId;

    if (ano !== undefined && isNaN(parseInt(ano))){
      return res.status(400).json({ erro: "O campo year tem de ser numérico" });
    }

    const resultado = await livroService.atualizarLivro(req.params.id, {
      title: titulo,
      year: ano !== undefined ? parseInt(ano) : undefined,
      genre: genero,
      available: disponivel,
      authorId: autorId
    });

    if (resultado === "NAO_ENCONTRADO"){
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    if (resultado === "AUTOR_NAO_ENCONTRADO"){
      return res.status(400).json({ erro: "O autor indicado não existe" });
    }

    return res.status(200).json(resultado);
  }
  catch (erro){
    next(erro);
  }
};

const apagarLivro = async (req, res, next) => {
  try{
    const resultado = await livroService.apagarLivro(req.params.id);

    if (resultado === "NAO_ENCONTRADO"){
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    return res.status(204).send();
  }
  catch (erro){
    next(erro);
  }
};

const pesquisarLivros = async (req, res, next) => {
  try{
    const titulo = req.query.title;

    if (!titulo){
      return res.status(400).json({ erro: "O parâmetro title é obrigatório" });
    }

    const livros = await livroService.pesquisarLivros(titulo);
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