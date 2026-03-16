const express = require("express");
const router = express.Router();
const authorController = require("../controllers/author.controller");

router.get("/", authorController.listarAutores);
router.get("/:id", authorController.procurarAutorPorId);
router.post("/", authorController.criarAutor);
router.put("/:id", authorController.atualizarAutor);
router.delete("/:id", authorController.apagarAutor);
router.get("/:id/books", authorController.listarLivrosDoAutor);

module.exports = router;