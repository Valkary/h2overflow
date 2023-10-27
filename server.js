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
    id: "",
};

const db = JSON.parse(await fs.readFile("./database.json"));

async function validateUser(email, password) {
    if (email in db.users) {
        if (await bcrypt.compare(password, db.users[email].password)) {
            user.email = email;
            user.name = db.users[email].name;
            user.id = db.users[email].id;
    
            console.log(`Succesfully logged in as ${db.users[email].name}!`);
            
            return true;
        } else {
            console.log(`Password validation error!`);
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

        const database_obj = db;

        database_obj.users[email] = {
            id: id_count + 1,
            name,
            password: hash
        }

        await fs.writeFile("./database.json", JSON.stringify(database_obj));

        return true;
    } catch (err) {
        console.error("==> Error creating user! Try again later");
        return false;
    }
}

// createUser("pepoclesng@gmail.com", "holamundo", "ElPepe");

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
    if (!authUser()) return res.redirect("/login");

    res.render("pages/month", { user });
});

app.post("/auth/login", async function (req, res) {
    console.log("Requesting auth");

    if (req.body?.email && req.body?.password) {
        if(await validateUser(req.body.email, req.body.password)) {
            res.redirect("/monthly_stats");
            return;
        }
    }

    res.redirect("/");
});

app.listen(8080);
console.log('Server is listening on port http://localhost:8080/');