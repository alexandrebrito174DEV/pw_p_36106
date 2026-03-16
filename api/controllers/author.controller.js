const authorService = require("../services/author.service");

const listarAutores = async (req, res, next) => {
  try{
    const autores = await authorService.listarAutores();
    return res.status(200).json(autores);
  }
  catch (erro){
    next(erro);
  }
};

const procurarAutorPorId = async (req, res, next) => {
  try{
    const { id } = req.params;
    const autor = await authorService.procurarAutorPorId(id);

    if (!autor){
      return res.status(404).json({ erro: "Autor não encontrado." });
    }

    return res.status(200).json(autor);
  }
  catch (erro){
    next(erro);
  }
};

const criarAutor = async (req, res, next) => {
  try{
    const { name, nationality, birthYear } = req.body;

    if (!name || !nationality || birthYear === undefined){
      return res.status(400).json({ erro: "Os campos name, nationality e birthYear são obrigatórios." });
    }

    if (typeof birthYear !== "number"){
      return res.status(400).json({ erro: "O campo birthYear tem de ser numérico." });
    }

    const novoAutor = await authorService.criarAutor({
      name,
      nationality,
      birthYear
    });

    return res.status(201).json(novoAutor);
  }
  catch (erro){
    next(erro);
  }
};

const atualizarAutor = async (req, res, next) => {
  try{
    const { id } = req.params;
    const { name, nationality, birthYear } = req.body;

    if (!name || !nationality || birthYear === undefined){
      return res.status(400).json({ erro: "Os campos name, nationality e birthYear são obrigatórios." });
    }

    if (typeof birthYear !== "number"){
      return res.status(400).json({ erro: "O campo birthYear tem de ser numérico." });
    }

    const autorAtualizado = await authorService.atualizarAutor(id, {
      name,
      nationality,
      birthYear
    });

    if (!autorAtualizado){
      return res.status(404).json({ erro: "Autor não encontrado." });
    }

    return res.status(200).json(autorAtualizado);
  }
  catch (erro){
    next(erro);
  }
};

const apagarAutor = async (req, res, next) => {
  try{
    const { id } = req.params;
    const resultado = await authorService.apagarAutor(id);

    if (resultado === "NAO_ENCONTRADO"){
      return res.status(404).json({ erro: "Autor não encontrado." });
    }

    if (resultado === "TEM_LIVROS"){
      return res.status(409).json({ erro: "Não é possível apagar um autor com livros associados." });
    }

    return res.status(200).json({ mensagem: "Autor apagado com sucesso." });
  }
  catch (erro){
    next(erro);
  }
};

const listarLivrosDoAutor = async (req, res, next) => {
  try{
    const { id } = req.params;
    const livros = await authorService.listarLivrosDoAutor(id);

    if (livros === "NAO_ENCONTRADO"){
      return res.status(404).json({ erro: "Autor não encontrado." });
    }

    return res.status(200).json(livros);
  }
  catch (erro){
    next(erro);
  }
};

module.exports = {
  listarAutores,
  procurarAutorPorId,
  criarAutor,
  atualizarAutor,
  apagarAutor,
  listarLivrosDoAutor
};