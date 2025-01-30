const express = require("express");
const { body, validationResult } = require("express-validator");
const validationSchema = require("./validators.js").default;
const dotenv = require("dotenv");
const app = express();
const { v4: uuidv4 } = require("uuid");
//const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
// const uri = "mongodb://localhost:27017/YG-connexion";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// const db = client.db("enissuedb");
const Issue = require("./models/issue").default;
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/enissuedb");

app.set("views", "./views");
app.set("view engine", "ejs");
dotenv.config();
app.use(express.urlencoded({ extended: true }));
/*
client
  .connect()
  .then(() => {
    console.log("Connected successfully to server");
  })
  .catch((err) => {
    console.log("Error connecting to server:", err);
  });
*/
let issues = [];

let formTitle = "Ajouter une issue";
let formAction = "/issues/create";
let formButton = "Ajouter une issue";

app.get("/", async (req, res) => {
  const issues = await Issue.find();
  res.render("index", { issues, formTitle, formAction, formButton });
});

app.post("/issues/create", validationSchema, async (req, res) => {
  const issues = await Issue.find();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("index", { errors: errors.array(), issues, issue: req.body, formTitle, formAction, formButton });
  }

  Issue.create({
    uuid: uuidv4(),
    auteur: req.body.auteur,
    date: req.body.date,
    titre: req.body.titre,
    description: req.body.description,
    etat: req.body.etat,
  }).then(() => {
    res.redirect("/");
  });
});

app.post("/issues/update/:uuid", (req, res) => {
  
  Issue.updateOne(
    { uuid: req.params.uuid },
    {
      auteur: req.body.auteur,
      date: req.body.date,
      titre: req.body.titre,
      description: req.body.description,
      etat: req.body.etat,
    }
  ).then(() => {
    res.redirect("/");
  });
});

app.get("/issues/update/:uuid", async (req, res) => {
  const issues = await Issue.find();
  Issue.findOne({ uuid: req.params.uuid }).then((issue) => {
    res.render("index", {
      issues,
      issue,
      formTitle: "Modifier l'issue",
      formAction: `/issues/update/${req.params.uuid}`,
      formButton: "Modifier l'issue",
    });
  });
});

app.get("/issues/delete/:uuid", (req, res) => {
  Issue.deleteOne({ uuid: req.params.uuid }).then(() => {
    res.redirect("/");
  });
});

/* ====================== ISSUE =====================*/
app.get("/issue/:id", (req, res) => {
  Issue.findOne({ uuid: req.params.id }).then((issue) => {
    res.render("issue", { issue, issueId: req.params.id });
  });
});

/* ====================== MESSAGES =====================*/
app.post("/issue/:id/messages/create", (req, res) => {
  Issue.updateOne(
    { uuid: req.params.id },
    { $push: { messages: req.body.message } }
  ).then(() => {
    res.redirect(`/issue/${req.params.id}`);
  });
});


app.listen(port, () => {
  console.log("Le serveur tourne sur le port " + port);
});

/* ====================== GESTION ERREUR NON PREVUE =====================*/
/*

app.get("/error", (req, res) => {
  throw new Error("This is a test error!");
});

// Middleware général
app.use((err, req, res, next) => {
  const erreur = { nom: err.name, message: err.message, stack: err.stack };
  res.status(404).render("error", { erreur });
});

*/

// le all capture toutes les méthodes de requête HTTP
app.all("*", (req, res) => {
  res.status(404).render("404");
});
