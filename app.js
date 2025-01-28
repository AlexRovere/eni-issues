const express = require("express");


const app = express();
const port = 3000;
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

let issues = [
  {
    auteur: "yonni",
    date: "2021-01-01",
    titre: "titre",
    description: "description",
    etat: "etat",
  },
];

let issue = [

];

let formTitle = "Ajouter une issue";
let formAction = "/issues/create";
let formButton = "Ajouter une issue";

app.get("/error", (req, res) => {
    throw new Error("This is a test error!");
});

// Middleware général
app.use((err, req, res, next) => {

  console.error(err.stack);
  const erreur = { nom: err.name, message: err.message, stack: err.stack };
  res.status(500).render("error", { erreur });
});

app.get("/", (req, res) => {
    res.render("index", { issues, issue, formTitle, formAction, formButton });
});

app.post("/issues/create", (req, res) => {
  const { auteur, date, titre, description, etat } = req.body;
  
  issues.push({ auteur, date, titre, description, etat });
  res.redirect("/");
});

app.post("/issues/update/:id", (req, res) => {
  const { auteur, date, titre, description, etat } = req.body;

  issues[req.params.id] = { auteur, date, titre, description, etat };
  res.redirect("/");
});

app.get("/issues/update/:id", (req, res) => {
  const issue = issues[req.params.id];
  res.render("index", { issues, issue, formTitle: "Modifier l'issue", formAction: `/issues/update/${req.params.id}`, formButton: "Modifier l'issue" });
});

app.get("/issues/delete/:id", (req, res) => {
    const id = req.params.id;
    issues.splice(id, 1);
    res.redirect("/"); 
});

app.listen(port, () => {
  console.log("Le serveur tourne sur le port " + port);

});
