"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Issue_1 = require("./types/Issue");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'pages'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const issues = [
    {
        id: 1,
        title: 'Ma première issue',
        description: 'ma description',
        author: 'Alex',
        state: Issue_1.State.OPEN,
        createdAt: new Date(),
        messages: []
    },
    {
        id: 2,
        title: 'Ma deuxième issue',
        description: 'ma description',
        author: 'Jean',
        state: Issue_1.State.OPEN,
        createdAt: new Date(),
        messages: []
    },
    {
        id: 3,
        title: 'Ma troisième issue',
        description: 'ma description',
        author: 'Pierre',
        state: Issue_1.State.OPEN,
        createdAt: new Date(),
        messages: []
    }
];
let idx = 4;
app.get(["/", "/issues"], (req, res) => {
    let data = {
        title: "bonjour",
        issues
    };
    res.render("issues", data);
});
app.post("/create/issues", (req, res) => {
    const issue = {
        id: idx++,
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        state: Issue_1.State.OPEN,
        createdAt: new Date(),
        messages: []
    };
    issues.push(issue);
    res.redirect("/issues");
});
app.get("/issues/close/:id", (req, res) => {
    if (req.params.id) {
        let arrayIdx = issues.findIndex(i => i.id === +req.params.id);
        if (arrayIdx > -1) {
            issues[arrayIdx].state = Issue_1.State.CLOSED;
        }
    }
    res.redirect("/");
});
app.get("/issues/delete/:id", (req, res) => {
    if (req.params.id) {
        let arrayIdx = issues.findIndex(i => i.id === +req.params.id);
        if (arrayIdx > -1) {
            issues.splice(arrayIdx, 1);
        }
    }
    res.redirect("/");
});
app.get("/issues/detail/:id", (req, res) => {
    if (req.params.id) {
        let issue = issues.find(i => i.id === +req.params.id);
        if (issue) {
            let data = {
                issue
            };
            res.render("detail", data);
        }
    }
});
app.get("/issues/update/:id", (req, res) => {
    if (req.params.id) {
        let issue = issues.find(i => i.id === +req.params.id);
        if (issue) {
            let data = {
                issue
            };
            res.render("update", data);
        }
    }
});
app.post("/issues/update", (req, res) => {
    if (req.body.id) {
        let arrayIdx = issues.findIndex(i => i.id === +req.body.id);
        if (arrayIdx > -1) {
            issues[arrayIdx].title = req.body.title || issues[arrayIdx].title;
            issues[arrayIdx].description = req.body.description || issues[arrayIdx].description;
            issues[arrayIdx].author = req.body.author || issues[arrayIdx].author;
        }
    }
    res.redirect("/");
});
app.post("/issues/message/create", (req, res) => {
    if (req.body.id) {
        let arrayIdx = issues.findIndex(i => i.id === +req.body.id);
        if (arrayIdx > -1) {
            issues[arrayIdx].messages.push(req.body.message);
        }
    }
    res.redirect(`/issues/detail/${req.body.id}`);
});
app.get("/issues/:issueId/messages/supprimer/:messageIdx", (req, res) => {
    if (req.params.issueId && req.params.messageIdx) {
        let issue = issues.find(i => i.id === +req.params.issueId);
        if (issue) {
            issue.messages.splice(+req.params.messageIdx, 1);
        }
        res.redirect(`/issues/detail/${req.params.issueId}`);
    }
});
app.listen(PORT, () => {
    console.info("Server running at PORT: ", PORT);
}).on("error", (error) => {
    console.error(error);
    throw new Error(error.message);
});
