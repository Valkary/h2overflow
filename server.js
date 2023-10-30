import express from 'express';
import fs from "fs/promises";
import bcrypt from "bcrypt";

const app = express();

const salt_rounds = 10;
const salt = await bcrypt.genSalt(salt_rounds);

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

let user = {
    email: "",
    name: "",
    lastname: "",
    unit: "",
    lang: "",
    id: "",
};

let db = JSON.parse(await fs.readFile("./database.json"));

async function validateUser(email, password) {
    if (email in db.users) {
        if (await bcrypt.compare(password, db.users[email].password)) {
            user.email = email;
            user.name = db.users[email].name;
            user.lastname = db.users[email].lastname;
            user.unit = db.users[email].unit;
            user.lang = db.users[email].lang;
            user.id = db.users[email].id;

            console.log(`Succesfully logged in as ${db.users[email].name}!`);

            return true;
        } else {
            console.log(`Password validation error!`);

            return false;
        }
    }

    return false;
}

function authUser() {
    if (!user.email) return false;
    return true;
}

async function createUser(email, password, name) {
    if (email in db.users) {
        console.error("==> User already in database!");
        return false;
    }

    try {
        const hash = await bcrypt.hash(password, salt);

        const id_count = db.id_count;

        db.users[email] = {
            id: id_count + 1,
            name,
            password: hash
        }

        db.id_count = db.id_count + 1;

        await fs.writeFile("./database.json", JSON.stringify(db));

        return true;
    } catch (err) {
        console.error("==> Error creating user! Try again later");
        console.error(err);
        return false;
    }
}

// createUser("tisk@gmail.com", "pass", "Comes");

// index page
app.get('/', function (req, res) {
    console.log("==> Requesting home");

    res.render("pages/home", { user });
});

app.get("/login", function (req, res) {
    console.log("==> Requesting login");
    if (authUser()) res.render("pages/home", { user });

    res.render('pages/login');
});

app.get("/monthly_stats", function (req, res) {
    console.log("==> Monthly stats!");
    if (!authUser()) {
        res.redirect("/login");
        return;
    }

    res.render("pages/month", { user });
});

app.get("/data_entry", function (req, res) {
    console.log("==> Data entry!");
    if (!authUser()) {
        res.redirect("/login");
        return;
    }

    res.render("pages/data", { user });
});

app.post("/auth/login", async function (req, res) {
    console.log("Requesting auth");

    if (req.body?.email && req.body?.password) {
        if (await validateUser(req.body.email, req.body.password)) {
            res.redirect("/monthly_stats");
            return;
        }
    }

    res.redirect("/");
});

app.get('/profile', function (req, res) {
    if (!authUser()) {
        res.redirect("/login");
        return;
    }

    res.render("pages/profile", {user});
}).post('/save_settings', async function(req,res) {
    console.log("==> Save settings!");

    const { firstname, lastname, email, unit, lang } = req.body;

    try {
        const prev = db.users[user.email];

        delete db.users[user.email];

        db.users[email] = {
            ...prev,
            id: user.id,
            name: firstname,
            lastname,
            unit,
            lang
        }
        
        user.email = email;
    
        await fs.writeFile("./database.json", JSON.stringify(db));
    } catch (err) {
        console.error(err);
        res.render("pages/profile");
    }

    res.render("pages/profile", {user});
}).post("/logout", function (_, res) {
    user = {
        email: "",
        name: "",
        id: "",
    };

    res.redirect("/login");
}).post("/del_acc", async function (_, res) {
    delete db.users[user.email];

    user = {
        email: "",
        name: "",
        id: "",
    };

    await fs.writeFile("./database.json", JSON.stringify(db));

    res.redirect("/login");
});

app.listen(8080);
console.log('Server is listening on port http://localhost:8080/');