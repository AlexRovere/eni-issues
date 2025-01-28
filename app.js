const express = require('express');

const app = express();
const port = 3000;
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});