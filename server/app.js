"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const express_validator_1 = require("express-validator");
const express_session_1 = __importDefault(require("express-session"));
const database_1 = __importDefault(require("./database"));
const Ticket_1 = __importStar(require("./models/Ticket"));
dotenv_1.default.config();
(0, database_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'pages'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (!process.env.SECRET || process.env.SECRET.trim() === '') {
    throw new Error('Le secret de session est manquant. Veuillez définir SECRET dans le fichier .env.');
}
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET
}));
app.get(["/", "/tickets"], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield Ticket_1.default.find();
    const errors = req.session.errors || [];
    const oldTicket = req.session.oldTicket || {};
    delete req.session.errors;
    delete req.session.oldTicket;
    let data = {
        tickets: tickets,
        ticket: oldTicket,
        errors: errors
    };
    res.render("tickets", data);
}));
app.post("/tickets/create", (0, express_validator_1.body)('title').notEmpty(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        req.session.errors = result.array();
        req.session.oldTicket = req.body;
        res.redirect("/tickets");
        return;
    }
    const newTicket = new Ticket_1.default({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        state: Ticket_1.State.OPEN,
        createdAt: new Date(),
        responses: []
    });
    yield Ticket_1.default.create(newTicket);
    res.redirect("/");
}));
app.get("/tickets/close/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id) {
        const ticket = yield Ticket_1.default.findById(req.params.id);
        if (ticket) {
            ticket.state = Ticket_1.State.CLOSED;
            yield ticket.save();
        }
    }
    res.redirect("/");
}));
app.get("/tickets/open/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id) {
        const ticket = yield Ticket_1.default.findById(req.params.id);
        if (ticket) {
            ticket.state = Ticket_1.State.OPEN;
            yield ticket.save();
        }
    }
    res.redirect("/");
}));
app.get("/tickets/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
    if (id) {
        // DB
        const ticketDeleted = yield Ticket_1.default.findByIdAndDelete(id);
        if (ticketDeleted) {
            console.info("Ticket supprimé :", ticketDeleted);
        }
        else {
            console.info("Ticket non trouvé");
        }
    }
    res.redirect("/");
}));
app.get("/tickets/detail/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id) {
        const ticket = yield Ticket_1.default.findById(req.params.id);
        if (ticket) {
            return res.render("detail", { ticket });
        }
    }
    res.redirect("/");
}));
app.get("/tickets/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id) {
        const ticket = yield Ticket_1.default.findById(req.params.id);
        if (ticket) {
            return res.render("update", { ticket });
        }
    }
    res.redirect("/");
}));
app.post("/tickets/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.id) {
        const ticket = yield Ticket_1.default.findById(req.body.id);
        if (ticket) {
            ticket.title = req.body.title || ticket.title;
            ticket.description = req.body.description || ticket.description;
            ticket.author = req.body.author || ticket.author;
            yield ticket.save();
        }
    }
    res.redirect("/");
}));
app.post("/tickets/responses/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.id) {
        const ticket = yield Ticket_1.default.findById(req.body.id);
        if (ticket) {
            ticket.responses.push(req.body.responses);
            yield ticket.save();
        }
    }
    res.redirect(`/tickets/detail/${req.body.id}`);
}));
app.get("/tickets/:ticketId/responses/delete/:messageIdx", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.ticketId && req.params.messageIdx) {
        const ticket = yield Ticket_1.default.findById(req.params.ticketId);
        if (ticket) {
            ticket.responses.splice(+req.params.messageIdx, 1);
            yield ticket.save();
        }
        res.redirect(`/tickets/detail/${req.params.ticketId}`);
    }
}));
app.all('*', (req, res) => {
    res.status(404).render('404');
});
app.listen(PORT, () => {
    console.info("Server running at PORT: ", PORT);
}).on("error", (error) => {
    console.error(error);
    throw new Error(error.message);
});
