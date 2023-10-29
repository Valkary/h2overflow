import express from 'express';
import fs from "fs/promises";
import bcrypt from "bcrypt";

import { activities } from './constants.js';

const app = express();

const salt_rounds = 10;
const salt = await bcrypt.genSalt(salt_rounds);

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

/**
* @typedef {{
*   id_count: number,
*   users: {
*     [email: string]: {
*       id: number,
*       name: string,
*       password: string
*     }
*   },
*   records: {
*     [userId: string]: {
*       [timestamp: number]: [number]
*     }
*   }
* }} Database
*/

/**
* @typedef {{
*   email: string,
*   name: string,
*   id: string
* }} User
*/

/**
 * @type {User}
 */
let user = {
    email: "",
    name: "",
    id: "",
};

/**
 * @type {Database}
 */
let db = JSON.parse(await fs.readFile("./database.json"));

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns 
 */
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

// index page
app.get('/', function (_, res) {
    console.log("==> Requesting home");

    res.render("pages/home", { user });
});

app.get("/login", function (_, res) {
    console.log("==> Requesting login");
    if (authUser()) res.render("pages/home", { user });

    res.render('pages/login');
});

app.get("/monthly_stats", function (_, res) {
    console.log("==> Monthly stats!");
    if (!authUser()) {
        res.redirect("/login");
        return;
    }

    const todays_date = new Date();
    const months_start = Date.UTC(todays_date.getFullYear(), todays_date.getUTCMonth(), 1);

    if (user.id in db.records) {
        const user_records = Object.keys(db.records[user.id]);
        let index = -1;

        for (let i = 0; i < user_records.length; i++) {
            if (user_records[i] >= months_start) {
                index = i;
                break;
            }
        }

        if (index > 0) return;

        const month_activities = user_records.slice(index);
        let res = {};

        for (let i = 0; i < month_activities.length; i++) {
            const day_activities = db.records[user.id][month_activities[i]];
            let saved_water = 0;

            for (let j = 0; j < day_activities.length; j++) {
                saved_water += day_activities[j];
            }

            res[month_activities[i]] = saved_water;
        }

        res.render("pages/month", { user, month: res });
    }

    res.render("pages/month", { user });
});

app.get("/data_entry", function (_, res) {
    console.log("==> Data entry!");
    if (!authUser()) {
        res.redirect("/login");
        return;
    }

    res.render("pages/data", { user, activities });
});

app.post("/add_activity", async function (req, res) {
    console.log("==> Adding activity!");

    if (!authUser()) {
        res.redirect("/login");
        return;
    }

    try {
        let user_records = {};

        if (user.id in db.records) {
            user_records = db.records[user.id];
        }

        const todays_date = new Date();
        const date = Date.UTC(todays_date.getFullYear(), todays_date.getUTCMonth(), todays_date.getUTCDate())

        if (date in user_records) {
            user_records[date].push(parseFloat(req.body.water, 10))
        } else {
            user_records[date] = [parseFloat(req.body.water, 10)]
        }


        db.records[user.id] = user_records;

        await fs.writeFile("./database.json", JSON.stringify(db));

        res.redirect("/data_entry?success=true");
    } catch (err) {
        res.redirect("/data_entry");
    }
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

app.listen(8080);
console.log('Server is listening on port http://localhost:8080/');