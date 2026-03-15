const express = require("express");
const router = express.Router();

const autorController = require("../controllers/author.controller");

// Top autores
router.get("/top", autorController.listarTopAutores);

// Listar todos os autores
router.get("/", autorController.listarAutores);

// Procurar autor por id
router.get("/:id", autorController.procurarAutorPorId);

// Criar autor
router.post("/", autorController.criarAutor);

// Atualizar autor
router.put("/:id", autorController.atualizarAutor);

// Apagar autor
router.delete("/:id", autorController.apagarAutor);

// Listar livros de um autor
router.get("/:id/books", autorController.listarLivrosDoAutor);

module.exports = router;