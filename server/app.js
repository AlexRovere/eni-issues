const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const connectDB = require('./database');
const TicketDb = require('./models/Ticket');


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

app.get(["/", "/tickets"], async (req, res) => {


  const tickets = await TicketDb.find()

  const errors = req.session.errors || [];
  const oldTicket = req.session.oldTicket || {};
  console.log(errors);

  delete req.session.errors;
  delete req.session.oldTicket;

  let data = {
    tickets: tickets,
    ticket: oldTicket,
    errors: errors
  }

  res.render("tickets", data)
})

app.post("/tickets/create",
  body('title').notEmpty().withMessage("Le titre est obligatoire"),
  body('description').notEmpty().withMessage("Le description est obligatoire"),
  body('author').notEmpty().withMessage("L'auteur est obligatoire")
  , async (req, res) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
      req.session.errors = result.array();
      req.session.oldTicket = req.body;
      res.redirect("/tickets")
      return
    }

    const newTicket = new TicketDb({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      state: "Ouvert",
      createdAt: new Date(),
      responses: []
    });

    await TicketDb.create(newTicket)

    res.redirect("/")
  })


app.get("/tickets/close/:id", async (req, res) => {

  if (req.params.id) {
    const ticket = await TicketDb.findById(req.params.id)

    if (ticket) {
      ticket.state = "Fermé"
      await ticket.save()
    }
  }

  res.redirect("/")
})


app.get("/tickets/open/:id", async (req, res) => {

  if (req.params.id) {
    const ticket = await TicketDb.findById(req.params.id)

    if (ticket) {
      ticket.state = "Ouvert"
      await ticket.save()
    }
  }

  res.redirect("/")
})

app.get("/tickets/delete/:id", async (req, res) => {

  const id = req.params?.id

  if (id) {
    const ticketDeleted = await TicketDb.findByIdAndDelete(id)
    if (ticketDeleted) {
      console.info("Ticket supprimé :", ticketDeleted);
    } else {
      console.info("Ticket non trouvé");
    }

  }
  res.redirect("/")
})


app.get("/tickets/detail/:id", async (req, res) => {
  if (req.params.id) {
    const ticket = await TicketDb.findById(req.params.id)

    if (ticket) {
      return res.render("detail", { ticket })
    }
  }
  res.redirect("/")
})


app.get("/tickets/update/:id", async (req, res) => {

  if (req.params.id) {
    const ticket = await TicketDb.findById(req.params.id)

    if (ticket) {
      return res.render("update", { ticket })
    }
  }
  res.redirect("/")
})

app.post("/tickets/update", async (req, res) => {

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

app.post("/tickets/responses/create", async (req, res) => {

  if (req.body.id) {
    const ticket = await TicketDb.findById(req.body.id)
    if (ticket) {
      ticket.responses.push(req.body.responses)
      await ticket.save()
    }
  }
  res.redirect(`/tickets/detail/${req.body.id}`)
})

app.get("/tickets/:ticketId/responses/delete/:messageIdx", async (req, res) => {

  if (req.params.ticketId && req.params.messageIdx) {
    const ticket = await TicketDb.findById(req.params.ticketId)
    if (ticket) {
      ticket.responses.splice(+req.params.messageIdx, 1)
      await ticket.save()
    }

    res.redirect(`/tickets/detail/${req.params.ticketId}`)
  }

})

app.all('*', (req, res) => {
  res.status(404).render('404');
});


app.listen(PORT, () => {
  console.info("Server running at PORT: ", PORT);
}).on("error", (error) => {
  console.error(error);
  throw new Error(error.message);
});