const autorService = require("../services/author.service");

const listarAutores = async (req, res, next) => {
  try{
    const autores = await autorService.listarAutores();
    return res.status(200).json(autores);
  }
  catch (erro){
    next(erro);
  }
};

const procurarAutorPorId = async (req, res, next) => {
  try{
    const autor = await autorService.procurarAutorPorId(req.params.id);

    if (!autor){
      return res.status(404).json({ erro: "Autor não encontrado" });
    }

    return res.status(200).json(autor);
  }
  catch (erro){
    next(erro);
  }
};

const criarAutor = async (req, res, next) => {
  try{
    const nome = req.body.name;
    const nacionalidade = req.body.nationality;
    const anoNascimento = req.body.birthYear;

    if (!nome){
      return res.status(400).json({ erro: "O nome do autor é obrigatório" });
    }

    const novoAutor = await autorService.criarAutor({
      name: nome,
      nationality: nacionalidade,
      birthYear: anoNascimento
    });

    return res.status(201).json(novoAutor);
  }
  catch (erro){
    next(erro);
  }
};

const atualizarAutor = async (req, res, next) => {
  try{
    const nome = req.body.name;
    const nacionalidade = req.body.nationality;
    const anoNascimento = req.body.birthYear;

    if (nome !== undefined && !nome){
      return res.status(400).json({ erro: "O nome do autor não pode estar vazio" });
    }

    const autorAtualizado = await autorService.atualizarAutor(req.params.id, {
      name: nome,
      nationality: nacionalidade,
      birthYear: anoNascimento
    });

    if (!autorAtualizado){
      return res.status(404).json({ erro: "Autor não encontrado" });
    }

    return res.status(200).json(autorAtualizado);
  }
  catch (erro){
    next(erro);
  }
};

const apagarAutor = async (req, res, next) => {
  try{
    const resultado = await autorService.apagarAutor(req.params.id);

    if (resultado === "NAO_ENCONTRADO"){
      return res.status(404).json({ erro: "Autor não encontrado" });
    }

    if (resultado === "TEM_LIVROS"){
      return res.status(409).json({ erro: "Não é possível apagar um autor com livros associados" });
    }

    return res.status(200).json({ mensagem: "Autor removido com sucesso" });
  }
  catch (erro){
    next(erro);
  }
};

const listarLivrosDoAutor = async (req, res, next) => {
  try{
    const resultado = await autorService.listarLivrosDoAutor(req.params.id);

    if (resultado === "NAO_ENCONTRADO"){
      return res.status(404).json({ erro: "Autor não encontrado" });
    }

    return res.status(200).json(resultado);
  }
  catch (erro){
    next(erro);
  }
};

const listarTopAutores = async (req, res, next) => {
  try{
    const autores = await autorService.listarTopAutores();
    return res.status(200).json(autores);
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
  listarLivrosDoAutor,
  listarTopAutores
};