const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

// premier middleware general
app.use((req, res, next) => {
  console.log(
    `methode=${req.method} url=${req.url} user-agent=${req.headers["user-agent"]}`
  );
  
  next();
});

app.get("/", (req, res) => {
 res.redirect("/index.html");
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
