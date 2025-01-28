const express = require('express');

const app = express();
const port = 3000;
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

let issues = [];

app.get("/", (req, res) => {
  res.render("index", { issues });
});

app.post("/add-issue", (req, res) => {
    const { titre, description, auteur, date, etat } = req.body;
    issues.push({ titre, description, auteur, date, etat });
    res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});