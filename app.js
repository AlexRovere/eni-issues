const express = require("express");


const app = express();
const port = 3000;
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

let issues = [];

app.get("/", (req, res) => {
  
  res.render("index", { issues });
});

app.post("/issues/create", (req, res) => {
  const { auteur, date, titre, description, etat } = req.body;
  
  issues.push({ auteur, date, titre, description, etat });
  res.redirect("/");
});
app.listen(port, () => {
  console.log("Le serveur tourne sur le port " + port);

});
