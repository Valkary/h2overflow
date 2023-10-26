import express from 'express';

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

let user = {
    email: "",
    password: "",
};

function authUser() {
    if (!user.email || !user.password) return false;
    return true;
}

// index page
app.get('/', function (req, res) {
    console.log("==> Requesting home");

    return res.render("pages/home", {
        user: user.email ? user.email.split("@")[0] : null,
    });
});

app.get("/login", function (req, res) {
    console.log("==> Requesting login");
    return res.render('pages/login');
});

app.get("/monthly_stats", function (req, res) {
    console.log("==> Monthly stats!");
    if (!authUser()) return res.redirect("/login");

    return res.render("pages/month");
});

app.post("/auth/login", function (req, res) {
    console.log("Requesting auth");

    if (req.body?.email && req.body?.password) {
        user.email = req.body.email;
        user.password = req.body.password;

        res.locals.username = req.body.email.split("@")[0];

        return res.redirect("/monthly_stats");
    }

    return res.redirect("/");
});

app.listen(8080);
console.log('Server is listening on port http://localhost:8080/');