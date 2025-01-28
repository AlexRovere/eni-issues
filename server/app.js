"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Ticket_1 = require("./types/Ticket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'pages'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const tickets = [
    {
        id: 1,
        title: 'Ma première ticket',
        description: 'ma description',
        author: 'Alex',
        state: Ticket_1.State.OPEN,
        createdAt: new Date(),
        responses: []
    },
    {
        id: 2,
        title: 'Ma deuxième ticket',
        description: 'ma description',
        author: 'Jean',
        state: Ticket_1.State.OPEN,
        createdAt: new Date(),
        responses: []
    },
    {
        id: 3,
        title: 'Ma troisième ticket',
        description: 'ma description',
        author: 'Pierre',
        state: Ticket_1.State.OPEN,
        createdAt: new Date(),
        responses: []
    }
];
let idx = 4;
app.get(["/", "/tickets"], (req, res) => {
    let data = {
        title: "bonjour",
        tickets
    };
    res.render("tickets", data);
});
app.post("/tickets/create", (req, res) => {
    const ticket = {
        id: idx++,
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        state: Ticket_1.State.OPEN,
        createdAt: new Date(),
        responses: []
    };
    tickets.push(ticket);
    res.redirect("/");
});
app.get("/tickets/close/:id", (req, res) => {
    if (req.params.id) {
        let arrayIdx = tickets.findIndex(i => i.id === +req.params.id);
        if (arrayIdx > -1) {
            tickets[arrayIdx].state = Ticket_1.State.CLOSED;
        }
    }
    res.redirect("/");
});
app.get("/tickets/delete/:id", (req, res) => {
    if (req.params.id) {
        let arrayIdx = tickets.findIndex(i => i.id === +req.params.id);
        if (arrayIdx > -1) {
            tickets.splice(arrayIdx, 1);
        }
    }
    res.redirect("/");
});
app.get("/tickets/detail/:id", (req, res) => {
    if (req.params.id) {
        let ticket = tickets.find(i => i.id === +req.params.id);
        if (ticket) {
            let data = {
                ticket
            };
            res.render("detail", data);
        }
    }
});
app.get("/tickets/update/:id", (req, res) => {
    if (req.params.id) {
        let ticket = tickets.find(i => i.id === +req.params.id);
        if (ticket) {
            let data = {
                ticket
            };
            res.render("update", data);
        }
    }
});
app.post("/tickets/update", (req, res) => {
    if (req.body.id) {
        let arrayIdx = tickets.findIndex(i => i.id === +req.body.id);
        if (arrayIdx > -1) {
            tickets[arrayIdx].title = req.body.title || tickets[arrayIdx].title;
            tickets[arrayIdx].description = req.body.description || tickets[arrayIdx].description;
            tickets[arrayIdx].author = req.body.author || tickets[arrayIdx].author;
        }
    }
    res.redirect("/");
});
app.post("/tickets/message/create", (req, res) => {
    if (req.body.id) {
        let arrayIdx = tickets.findIndex(i => i.id === +req.body.id);
        if (arrayIdx > -1) {
            tickets[arrayIdx].responses.push(req.body.message);
        }
    }
    res.redirect(`/tickets/detail/${req.body.id}`);
});
app.get("/tickets/:ticketId/responses/supprimer/:messageIdx", (req, res) => {
    if (req.params.ticketId && req.params.messageIdx) {
        let ticket = tickets.find(i => i.id === +req.params.ticketId);
        if (ticket) {
            ticket.responses.splice(+req.params.messageIdx, 1);
        }
        res.redirect(`/tickets/detail/${req.params.ticketId}`);
    }
});
app.all('*', (req, res) => {
    res.status(404).render('404');
});
app.listen(PORT, () => {
    console.info("Server running at PORT: ", PORT);
}).on("error", (error) => {
    console.error(error);
    throw new Error(error.message);
});
