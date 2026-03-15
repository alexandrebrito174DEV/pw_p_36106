const express = require("express");
const router = express.Router();

const estatisticasController = require("../controllers/stats.controller");

router.get("/", estatisticasController.obterEstatisticasGerais);
router.get("/genres", estatisticasController.obterEstatisticasPorGenero);

module.exports = router;