import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from 'path'
import { Ticket, State } from "./types/Ticket";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const tickets: Ticket[] = [
  {
    id: 1,
    title: 'Ma première ticket',
    description: 'ma description',
    author: 'Alex',
    state: State.OPEN,
    createdAt: new Date(),
    responses: []
  },
  {
    id: 2,
    title: 'Ma deuxième ticket',
    description: 'ma description',
    author: 'Jean',
    state: State.OPEN,
    createdAt: new Date(),
    responses: []

  },
  {
    id: 3,
    title: 'Ma troisième ticket',
    description: 'ma description',
    author: 'Pierre',
    state: State.OPEN,
    createdAt: new Date(),
    responses: []
  }
]

let idx = 4

app.get(["/", "/tickets"], (req: Request, res: Response) => {
  let data = {
    title: "bonjour",
    tickets
  }

  res.render("tickets", data)
})

app.post("/tickets/create", (req: Request, res: Response) => {

  const ticket: Ticket = {
    id: idx++,
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    state: State.OPEN,
    createdAt: new Date(),
    responses: []
  }

  tickets.push(ticket)

  res.redirect("/")
})


app.get("/tickets/close/:id", (req: Request, res: Response) => {

  if (req.params.id) {

    let arrayIdx: number = tickets.findIndex(i => i.id === +req.params.id)

    if (arrayIdx > -1) {
      tickets[arrayIdx].state = State.CLOSED
    }
  }

  res.redirect("/")
})

app.get("/tickets/delete/:id", (req: Request, res: Response) => {

  if (req.params.id) {

    let arrayIdx: number = tickets.findIndex(i => i.id === +req.params.id)

    if (arrayIdx > -1) {
      tickets.splice(arrayIdx, 1)
    }
  }
  res.redirect("/")
})


app.get("/tickets/detail/:id", (req: Request, res: Response) => {
  if (req.params.id) {
    let ticket: Ticket | undefined = tickets.find(i => i.id === +req.params.id)

    if (ticket) {
      let data = {
        ticket
      }
      res.render("detail", data)
    }
  }
})


app.get("/tickets/update/:id", (req: Request, res: Response) => {

  if (req.params.id) {

    let ticket: Ticket | undefined = tickets.find(i => i.id === +req.params.id)

    if (ticket) {
      let data = {
        ticket
      }
      res.render("update", data)
    }
  }
})

app.post("/tickets/update", (req: Request, res: Response) => {

  if (req.body.id) {

    let arrayIdx: number = tickets.findIndex(i => i.id === +req.body.id)

    if (arrayIdx > -1) {
      tickets[arrayIdx].title = req.body.title || tickets[arrayIdx].title
      tickets[arrayIdx].description = req.body.description || tickets[arrayIdx].description
      tickets[arrayIdx].author = req.body.author || tickets[arrayIdx].author
    }
  }
  res.redirect("/")
})

app.post("/tickets/message/create", (req: Request, res: Response) => {

  if (req.body.id) {

    let arrayIdx: number = tickets.findIndex(i => i.id === +req.body.id)

    if (arrayIdx > -1) {
      tickets[arrayIdx].responses.push(req.body.message)
    }
  }
  res.redirect(`/tickets/detail/${req.body.id}`)
})

app.get("/tickets/:ticketId/responses/supprimer/:messageIdx", (req: Request, res: Response) => {

  if (req.params.ticketId && req.params.messageIdx) {

    let ticket: Ticket | undefined = tickets.find(i => i.id === +req.params.ticketId)

    if (ticket) {
      ticket.responses.splice(+req.params.messageIdx, 1)
    }
    res.redirect(`/tickets/detail/${req.params.ticketId}`)
  }

})

app.all('*', (req: Request, res: Response) => {
  res.status(404).render('404');
});


app.listen(PORT, () => {
  console.info("Server running at PORT: ", PORT);
}).on("error", (error) => {
  console.error(error);
  throw new Error(error.message);
});