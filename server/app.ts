import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from 'path'
import { body, ValidationError, validationResult } from 'express-validator';
import session from 'express-session'
import connectDB from './database'
import User from './models/User'
import Movie from './models/Movie'
import TicketDb, { ITicket, State } from './models/Ticket'


dotenv.config();
connectDB()
const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

if (!process.env.SECRET || process.env.SECRET.trim() === '') {
  throw new Error('Le secret de session est manquant. Veuillez définir SECRET dans le fichier .env.');
}

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET
}));

// Types pour la session
declare module 'express-session' {
  interface Session {
    errors?: ValidationError[];
    oldTicket?: Partial<ITicket>;
  }
}

app.get(["/", "/tickets"], async (req: Request, res: Response) => {


  const tickets = await TicketDb.find()

  const errors = req.session.errors || [];
  const oldTicket = req.session.oldTicket || {};

  delete req.session.errors;
  delete req.session.oldTicket;

  let data = {
    tickets: tickets,
    ticket: oldTicket,
    errors: errors
  }

  res.render("tickets", data)
})

app.post("/tickets/create", body('title').notEmpty(), async (req: Request, res: Response) => {

  const result = validationResult(req);

  if (!result.isEmpty()) {
    req.session.errors = result.array();
    req.session.oldTicket = req.body;
    res.redirect("/tickets")
    return
  }

  const newTicket: ITicket = new TicketDb({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    state: State.OPEN,
    createdAt: new Date(),
    responses: []
  });

  await TicketDb.create(newTicket)

  res.redirect("/")
})


app.get("/tickets/close/:id", async (req: Request, res: Response) => {

  if (req.params.id) {
    const ticket = await TicketDb.findById(req.params.id)

    if (ticket) {
      ticket.state = State.CLOSED
      await ticket.save()
    }
  }

  res.redirect("/")
})


app.get("/tickets/open/:id", async (req: Request, res: Response) => {

  if (req.params.id) {
    const ticket = await TicketDb.findById(req.params.id)

    if (ticket) {
      ticket.state = State.OPEN
      await ticket.save()
    }
  }

  res.redirect("/")
})

app.get("/tickets/delete/:id", async (req: Request, res: Response) => {

  const id = req.params?.id

  if (id) {
    // DB
    const ticketDeleted = await TicketDb.findByIdAndDelete(id)
    if (ticketDeleted) {
      console.info("Ticket supprimé :", ticketDeleted);
    } else {
      console.info("Ticket non trouvé");
    }

  }
  res.redirect("/")
})


app.get("/tickets/detail/:id", async (req: Request, res: Response) => {
  if (req.params.id) {
    const ticket = await TicketDb.findById(req.params.id)

    if (ticket) {
      return res.render("detail", { ticket })
    }
  }
  res.redirect("/")
})


app.get("/tickets/update/:id", async (req: Request, res: Response) => {

  if (req.params.id) {
    const ticket = await TicketDb.findById(req.params.id)

    if (ticket) {
      return res.render("update", { ticket })
    }
  }
  res.redirect("/")
})

app.post("/tickets/update", async (req: Request, res: Response) => {

  if (req.body.id) {
    const ticket = await TicketDb.findById(req.body.id)

    if (ticket) {
      ticket.title = req.body.title || ticket.title
      ticket.description = req.body.description || ticket.description
      ticket.author = req.body.author || ticket.author
      await ticket.save()
    }
  }
  res.redirect("/")
})

app.post("/tickets/responses/create", async (req: Request, res: Response) => {

  if (req.body.id) {
    const ticket = await TicketDb.findById(req.body.id)
    if (ticket) {
      ticket.responses.push(req.body.responses)
      await ticket.save()
    }
  }
  res.redirect(`/tickets/detail/${req.body.id}`)
})

app.get("/tickets/:ticketId/responses/delete/:messageIdx", async (req: Request, res: Response) => {

  if (req.params.ticketId && req.params.messageIdx) {
    const ticket = await TicketDb.findById(req.params.ticketId)
    if (ticket) {
      ticket.responses.splice(+req.params.messageIdx, 1)
      await ticket.save()
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