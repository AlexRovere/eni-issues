import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from 'path'
import { Issue, State } from "./types/Issue";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const issues: Issue[] = [
  {
    id: 1,
    title: 'Ma première issue',
    description: 'ma description',
    author: 'Alex',
    state: State.OPEN,
    createdAt: new Date(),
    messages: []
  },
  {
    id: 2,
    title: 'Ma deuxième issue',
    description: 'ma description',
    author: 'Jean',
    state: State.OPEN,
    createdAt: new Date(),
    messages: []

  },
  {
    id: 3,
    title: 'Ma troisième issue',
    description: 'ma description',
    author: 'Pierre',
    state: State.OPEN,
    createdAt: new Date(),
    messages: []
  }
]

let idx = 4

app.get(["/", "/issues"], (req: Request, res: Response) => {
  let data = {
    title: "bonjour",
    issues
  }

  res.render("issues", data)
})

app.post("/create/issues", (req: Request, res: Response) => {

  const issue: Issue = {
    id: idx++,
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    state: State.OPEN,
    createdAt: new Date(),
    messages: []
  }

  issues.push(issue)

  res.redirect("/issues")
})


app.get("/issues/close/:id", (req: Request, res: Response) => {

  if (req.params.id) {

    let arrayIdx: number = issues.findIndex(i => i.id === +req.params.id)

    if (arrayIdx > -1) {
      issues[arrayIdx].state = State.CLOSED
    }
  }

  res.redirect("/")
})

app.get("/issues/delete/:id", (req: Request, res: Response) => {

  if (req.params.id) {

    let arrayIdx: number = issues.findIndex(i => i.id === +req.params.id)

    if (arrayIdx > -1) {
      issues.splice(arrayIdx, 1)
    }
  }
  res.redirect("/")
})


app.get("/issues/detail/:id", (req: Request, res: Response) => {
  if (req.params.id) {
    let issue: Issue | undefined = issues.find(i => i.id === +req.params.id)

    if (issue) {
      let data = {
        issue
      }
      res.render("detail", data)
    }
  }
})


app.get("/issues/update/:id", (req: Request, res: Response) => {

  if (req.params.id) {

    let issue: Issue | undefined = issues.find(i => i.id === +req.params.id)

    if (issue) {
      let data = {
        issue
      }
      res.render("update", data)
    }
  }
})

app.post("/issues/update", (req: Request, res: Response) => {

  if (req.body.id) {

    let arrayIdx: number = issues.findIndex(i => i.id === +req.body.id)

    if (arrayIdx > -1) {
      issues[arrayIdx].title = req.body.title || issues[arrayIdx].title
      issues[arrayIdx].description = req.body.description || issues[arrayIdx].description
      issues[arrayIdx].author = req.body.author || issues[arrayIdx].author
    }
  }
  res.redirect("/")
})

app.post("/issues/message/create", (req: Request, res: Response) => {

  if (req.body.id) {

    let arrayIdx: number = issues.findIndex(i => i.id === +req.body.id)

    if (arrayIdx > -1) {
      issues[arrayIdx].messages.push(req.body.message)
    }
  }
  res.redirect(`/issues/detail/${req.body.id}`)
})

app.get("/issues/:issueId/messages/supprimer/:messageIdx", (req: Request, res: Response) => {

  if (req.params.issueId && req.params.messageIdx) {

    let issue: Issue | undefined = issues.find(i => i.id === +req.params.issueId)

    if (issue) {
      issue.messages.splice(+req.params.messageIdx, 1)
    }
    res.redirect(`/issues/detail/${req.params.issueId}`)
  }

})


app.listen(PORT, () => {
  console.info("Server running at PORT: ", PORT);
}).on("error", (error) => {
  console.error(error);
  throw new Error(error.message);
});