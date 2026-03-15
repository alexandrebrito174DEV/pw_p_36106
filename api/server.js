// Configurações iniciais

// Ficheiro .env
require("dotenv").config({ path: "./.env" });

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Ligação à base de dados
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
  adapter: adapter
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Porta
const PORT = process.env.SERVER_PORT || 4242;
const JWT_SECRET = process.env.JWT_SECRET;

// --------------------------------------------------------------------
// Funções da autenticação
// --------------------------------------------------------------------

// Verifica se a chave de acesso foi enviada e se é válida
function autenticarToken(req, res, next){
  const authHeader = req.headers.authorization;

  if (!authHeader){
    return res.status(401).json({ erro: "Chave de acesso em falta" });
  }

  const partes = authHeader.split(" ");

  // Bearer é o nome usado antes da chave de acesso (header Authorization - transmite informações de autenticação)
  if (partes.length !== 2 || partes[0] !== "Bearer"){
    return res.status(401).json({ erro: "Chave de acesso inválida" });
  }

  const token = partes[1];

  try{
    req.utilizador = jwt.verify(token, JWT_SECRET);
    next();
  }
  catch (erro){
    return res.status(401).json({ erro: "Chave de acesso inválida" });
  }
}

// Rotas Gerais

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello, my API works 🚀 v1.0.19" });
});

app.get("/users", (req, res) => {
  return res.status(200).json({ message: "OK - GET users" });
});

app.post("/users", (req, res) => {
  return res.status(201).json({ message: "OK - POST users" });
});

app.put("/users/:id", (req, res) => {
  return res.status(200).json({ message: "OK - PUT users" });
});

app.delete("/users/:id", (req, res) => {
  return res.status(200).json({ message: "OK - DELETE users" });
});

// --------------------------------------------------------------------
// Autenticação
// --------------------------------------------------------------------

// Registo de utilizador
app.post("/auth/register", async (req, res) => {
  try{
    const nome = req.body.nome;
    const email = req.body.email;
    const password = req.body.password;

    if (!nome || !email || !password){
      return res.status(400).json({ erro: "Nome, email e password são obrigatórios" });
    }

    const utilizadorExistente = await prisma.utilizador.findUnique({
      where: {
        email: email
      }
    });

    if (utilizadorExistente){
      return res.status(409).json({ erro: "Já existe um utilizador com esse email" });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10); // bcrypt é a biblioteca usada para proteger a password
    // hash é a versão codificada e protegida da password (o 10 indica o nível de segurança usado neste processo)

    const novoUtilizador = await prisma.utilizador.create({
      data: {
        nome: nome,
        email: email,
        password: passwordEncriptada
      }
    });

    return res.status(201).json({
      mensagem: "Utilizador registado com sucesso",
      utilizador: {
        id: novoUtilizador.id,
        nome: novoUtilizador.nome,
        email: novoUtilizador.email
      }
    });
  }
  catch (erro){
    console.error("ERRO POST /auth/register:", erro);
    return res.status(500).json({ erro: "Erro ao registar utilizador." });
  }
});

// Login do utilizador
app.post("/auth/login", async (req, res) => {
  try{
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password){
      return res.status(400).json({ erro: "Email e password são obrigatórios" });
    }

    const utilizador = await prisma.utilizador.findUnique({
      where: {
        email: email
      }
    });

    if (!utilizador){
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const passwordCorreta = await bcrypt.compare(password, utilizador.password);
    // bcrypt.compare compara a password inserida com a password protegida guardada

    if (!passwordCorreta){
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    // Cria a chave de acesso com os dados principais do utilizador
    const token = jwt.sign(
      {
        id: utilizador.id,
        nome: utilizador.nome,
        email: utilizador.email
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      mensagem: "Login efetuado com sucesso",
      token: token
    });
  }
  catch (erro){
    console.error("ERRO POST /auth/login:", erro);
    return res.status(500).json({ erro: "Erro no login." });
  }
});

// Perfil autenticado
app.get("/perfil", autenticarToken, async (req, res) => {
  try{
    const utilizador = await prisma.utilizador.findUnique({
      where: {
        id: req.utilizador.id
      },
      select: {
        id: true,
        nome: true,
        email: true
      }
    });

    if (!utilizador){
      return res.status(404).json({ erro: "Utilizador não encontrado" });
    }

    return res.status(200).json(utilizador);
  }
  catch (erro){
    console.error("ERRO GET /perfil:", erro);
    return res.status(500).json({ erro: "Erro ao obter perfil." });
  }
});

// --------------------------------------------------------------------
// API de filmes
// --------------------------------------------------------------------

// Array - filmes
let filmes = [
  { id: 1, titulo: "Inception", ano: 2010 },
  { id: 2, titulo: "Interstellar", ano: 2014 }
];

app.get("/filmes", (req, res) => {
  return res.status(200).json(filmes);
});

app.get("/filmes/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)){
    return res.status(400).json({ erro: "Id inválido" });
  }

  const filme = filmes.find((filmeAtual) => filmeAtual.id === id);

  if (!filme){
    return res.status(404).json({ erro: "Filme não encontrado" });
  }

  return res.status(200).json(filme);
});

app.post("/filmes", (req, res) => {
  const titulo = req.body.titulo;
  const ano = req.body.ano;

  if (!titulo || !ano){
    return res.status(400).json({ erro: "Titulo e ano são obrigatórios" });
  }

  const novoFilme = {
    id: filmes.length + 1,
    titulo: titulo,
    ano: ano
  };

  filmes.push(novoFilme);

  return res.status(201).json(novoFilme);
});

app.put("/filmes/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)){
    return res.status(400).json({ erro: "Id inválido" });
  }

  const filme = filmes.find((filmeAtual) => filmeAtual.id === id);

  if (!filme){
    return res.status(404).json({ erro: "Filme não encontrado" });
  }

  const titulo = req.body.titulo;
  const ano = req.body.ano;

  if (titulo){
    filme.titulo = titulo;
  }

  if (ano){
    filme.ano = ano;
  }

  return res.status(200).json(filme);
});

app.delete("/filmes/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)){
    return res.status(400).json({ erro: "Id inválido" });
  }

  const indice = filmes.findIndex((filmeAtual) => filmeAtual.id === id);

  if (indice === -1){
    return res.status(404).json({ erro: "Filme não encontrado" });
  }

  filmes.splice(indice, 1); // splice - remove elementos do array (a partir da posição encontrada)

  return res.status(200).json({ mensagem: "Filme removido" });
});

// --------------------------------------------------------------------
// API de tarefas
// --------------------------------------------------------------------

// Prioridades
const PRIORIDADES = ["baixa", "media", "alta"];

// Verifica se a prioridade inserida existe
function prioridadeValida(prioridade){
  let i;

  for (i = 0; i < PRIORIDADES.length; i++){
    if (PRIORIDADES[i] === prioridade){
      return true;
    }
  }

  return false;
}

// Converte o id recebido para número
function parseIdTarefa(param){
  const id_tarefa = parseInt(param);

  if (isNaN(id_tarefa)){
    return -1;
  }

  return id_tarefa;
}

app.get("/tarefas", autenticarToken, async (req, res) => {

  // async - indica que esta rota vai usar operações com a base de dados (tem de aguardar pela receção dos dados)

  try{// try - executa o código normalmente se ocorrer erro o programa não crasha

    const tarefas = await prisma.tarefa.findMany({
      where: {
        utilizadorId: req.utilizador.id
      }
    });

    return res.status(200).json(tarefas);
  }
  catch (erro){
    // o catch trata do erro se for no try
    // mostra o erro no servidor e devolve resposta desse erro

    console.error("ERRO GET /tarefas:", erro);
    return res.status(500).json({ erro: "Erro ao listar tarefas." });
  }
});

app.get("/tarefas/statistics", autenticarToken, async (req, res) => {
  try{
    const tarefas = await prisma.tarefa.findMany({
      where: {
        utilizadorId: req.utilizador.id
      }
    });

    const total = tarefas.length;
    let completas = 0;

    for (let i = 0; i < tarefas.length; i++){
      if (tarefas[i].concluida){
        completas++;
      }
    }

    const pendentes = total - completas;

    return res.status(200).json({ total, completas, pendentes });
  }
  catch (erro){
    console.error("ERRO GET /tarefas/statistics:", erro);
    return res.status(500).json({ erro: "Erro ao calcular estatísticas." });
  }
});

app.get("/tarefas/:id", autenticarToken, async (req, res) => {
  try{
    const id_tarefa = parseIdTarefa(req.params.id);

    if (id_tarefa === -1){
      return res.status(400).json({ erro: "Id inválido" });
    }

    const tarefa = await prisma.tarefa.findFirst({
      where: {
        id: id_tarefa,
        utilizadorId: req.utilizador.id
      }
    });

    if (!tarefa){
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    return res.status(200).json(tarefa);
  }
  catch (erro){
    console.error("ERRO GET /tarefas/:id:", erro);
    return res.status(500).json({ erro: "Erro ao procurar tarefa." });
  }
});

app.post("/tarefas", autenticarToken, async (req, res) => {
  try{
    const titulo = req.body.titulo;
    const prioridade = req.body.prioridade;

    if (!titulo || !prioridade){
      return res.status(400).json({ erro: "A indicação do título e da prioridade são obrigatórias" });
    }

    if (!prioridadeValida(prioridade)){
      return res.status(400).json({ erro: "Prioridade inválida. Nota: Só existem 3 tipos de prioridade: baixa, média ou alta" });
    }

    const novaTarefa = await prisma.tarefa.create({
      data: {
        titulo: titulo,
        concluida: false,
        prioridade: prioridade,
        utilizadorId: req.utilizador.id
      }
    });

    return res.status(201).json(novaTarefa);
  }
  catch (erro){
    console.error("ERRO POST /tarefas:", erro);
    return res.status(500).json({ erro: "Erro ao criar tarefa." });
  }
});

app.put("/tarefas/:id", autenticarToken, async (req, res) => {
  try{
    const id_tarefa = parseIdTarefa(req.params.id);

    if (id_tarefa === -1){
      return res.status(400).json({ erro: "Id inválido" });
    }

    const tarefa = await prisma.tarefa.findFirst({
      where: {
        id: id_tarefa,
        utilizadorId: req.utilizador.id
      }
    });

    if (!tarefa){
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    const titulo = req.body.titulo;
    const concluida = req.body.concluida;
    const prioridade = req.body.prioridade;

    let dadosAtualizados = {};

    if (titulo !== undefined){
      if (!titulo){
        return res.status(400).json({ erro: "A secção do título não pode estar vazia" });
      }

      dadosAtualizados.titulo = titulo;
    }

    if (concluida !== undefined){
      if (concluida !== true && concluida !== false){
        return res.status(400).json({ erro: "Para estar concluída temos de colocar true ou false" });
      }

      dadosAtualizados.concluida = concluida;
    }

    if (prioridade !== undefined){
      if (!prioridadeValida(prioridade)){
        return res.status(400).json({ erro: "Prioridade inválida. Nota: Só existem 3 tipos de prioridade: baixa, média ou alta" });
      }

      dadosAtualizados.prioridade = prioridade;
    }

    const tarefaAtualizada = await prisma.tarefa.update({

      // update - atualiza os dados do registo

      where: {
        id: id_tarefa
      },

      data: dadosAtualizados
    });

    return res.status(200).json(tarefaAtualizada);
  }
  catch (erro){
    console.error("ERRO PUT /tarefas/:id:", erro);
    return res.status(500).json({ erro: "Erro ao atualizar tarefa." });
  }
});

app.delete("/tarefas/:id", autenticarToken, async (req, res) => {
  try{
    const id_tarefa = parseIdTarefa(req.params.id);

    if (id_tarefa === -1){
      return res.status(400).json({ erro: "Id inválido" });
    }

    const tarefa = await prisma.tarefa.findFirst({
      where: {
        id: id_tarefa,
        utilizadorId: req.utilizador.id
      }
    });

    if (!tarefa){
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    await prisma.tarefa.delete({
      where: {
        id: id_tarefa
      }
    });

    return res.status(200).json({ mensagem: "Tarefa removida" });
  }
  catch (erro){
    console.error("ERRO DELETE /tarefas/:id:", erro);
    return res.status(500).json({ erro: "Erro ao remover tarefa." });
  }
});

if (process.env.NODE_ENV !== "production"){
  app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
  });
}

module.exports = app;