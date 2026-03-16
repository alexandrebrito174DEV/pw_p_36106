const express = require("express");
const cors = require("cors");

const authorRoutes = require("./routes/author.routes");
const bookRoutes = require("./routes/book.routes");
const statsRoutes = require("./routes/stats.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
const PORT = process.env.SERVER_PORT || 4242;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    mensagem: "API Biblioteca Avançada a funcionar.",
    versao: "1.0.0"
  });
});

app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);
app.use("/stats", statsRoutes);

app.use((req, res) => {
  return res.status(404).json({
    erro: "Rota não encontrada."
  });
});

app.use(errorMiddleware);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
  });
}

module.exports = app;