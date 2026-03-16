const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");

router.get("/", statsController.obterEstatisticasGerais);
router.get("/genres", statsController.obterEstatisticasPorGenero);

module.exports = router;