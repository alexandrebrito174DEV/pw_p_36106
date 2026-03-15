const express = require("express");
const router = express.Router();

const livroController = require("../controllers/book.controller");

// Pesquisa por título
router.get("/search", livroController.pesquisarLivros);

// Listar todos os livros
router.get("/", livroController.listarLivros);

// Procurar livro por id
router.get("/:id", livroController.procurarLivroPorId);

// Criar livro
router.post("/", livroController.criarLivro);

// Atualizar livro
router.put("/:id", livroController.atualizarLivro);

// Apagar livro
router.delete("/:id", livroController.apagarLivro);

module.exports = router;