const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");

router.get("/", bookController.listarLivros);
router.get("/search", bookController.pesquisarLivros);
router.get("/:id", bookController.procurarLivroPorId);
router.post("/", bookController.criarLivro);
router.put("/:id", bookController.atualizarLivro);
router.delete("/:id", bookController.apagarLivro);

module.exports = router;