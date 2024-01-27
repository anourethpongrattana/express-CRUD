require("dotenv").config();

require("./config/db");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

require("./models/Users.model");
require("./models/Articles.model");

const app = express();
app.use(morgan("dev"));

// Configuration CORS pour accepter les requêtes cross-origin
const corsOptions = {
  origin: true, // ou spécifiez des domaines spécifiques au lieu de true
  credentials: true, // pour permettre l'envoi de cookies et de headers d'autorisation
  optionsSuccessStatus: 200 // Pour les navigateurs plus anciens qui ne supportent pas 204
};

app.use(cors(corsOptions));


app.get("/", (req, res) => {
  res.json({ message: "voici la réponse" });
});


app.use("/api", require("./routes/index.routes"));

app.listen(process.env.PORT, () => {
  console.log(`Running on : http://localhost:${process.env.PORT}`);
});
