import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'
import bcrypt from 'bcrypt';
import { Activity, User, UserLoginType, UserType, user_login_schema, user_object_schema } from './types.js';
import jwt from "jsonwebtoken";
import cors from "cors";

const uri = `mongodb+srv://pepe:${process.env.DB_PASS}@cluster0.jxl1su3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
await mongoose.connect(uri);

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
const port = 3000;

app.get('/', (_, res) => {
    res.send('Hello NOD Readers!');
});

app.post('/api/users/create', async (req, res) => {
    console.log("==> Creating new user...");
    const new_user = req.body as UserType;

    try {
        user_object_schema.parse(new_user);

        if (await User.findOne({ email: new_user.email })) {
            console.log("==> User already in db!");
            return res.status(409).json({
                success: false,
                message: "Email already in use"
            })
        };

        const hashed_pwd = await bcrypt.hash(new_user.password, 10);

        await new User({
            ...new_user,
            password: hashed_pwd
        }).save();

        const { password, ...user_obj } = new_user;

        const token = jwt.sign(user_obj, process.env.JWT_SECRET as string);

        console.log("==> User successfully created and saved to the db!");
        return res.status(200).json({ success: true, token });
    } catch (err) {
        console.log("==> Error: ", err);
        return res.status(400).send(err);
    }
});

app.post("/api/users/login", async (req, res) => {
    console.log("==> Attempting to login user...");
    const login_creds = req.body as UserLoginType;

    try {
        user_login_schema.parse(login_creds);

        const user = await User.findOne({ email: login_creds.email });

        if (!user) {
            console.log("==> No user found with the given email");
            return res.status(404).json({
                success: false,
                message: "No email found"
            });
        }

        console.log("==> User found in database, verifying password...");

        if (!(await bcrypt.compare(login_creds.password, user.password))) {
            console.log("==> Wrong password for the account");
            return res.status(401).json({
                success: false,
                message: "Wrong password"
            });
        }
        console.log("==> Password verified, creating token...");

        const user_obj = {
            email: user.email,
            name: user.name,
            last_names: user.last_names,
            username: user.username,
            profile_picture: user.profile_picture,
            units: user.units,
            language: user.language
        };

        const token = jwt.sign(user_obj, process.env.JWT_SECRET as string);

        console.log("==> Token created, user signin complete!");
        return res.status(200).json({ success: true, token });
    } catch (err) {
        console.log("==> Error: ", err)
        return res.status(400).json(err);
    }
});

async function verifyJWT(req: Request, res: Response, next: NextFunction) {
    console.log("==> Verifying authorization token...");

    const token = req.headers.authorization;

    if (!token) {
        console.log("==> No token provided!");
        return res.status(401).json({
            success: false,
            message: "No token found",
        });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
        console.log("==> Token verified!");
        return next();
    } catch (err) {
        console.log("==> Authorization failed!");
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }
}

app.post("/api/activities/create", verifyJWT, async (req, res) => {
    console.log("==> Creating activity in db...");
    const { activity_id, created_at, litters_saved } = req.body;

    const token = req.headers.authorization as string;
    const user = jwt.decode(token) as UserType;

    const db_activity = new Activity({
        user: user.email,
        activity: activity_id,
        created_at,
        litters_saved
    });

    await db_activity.save();

    console.log("==> Activity successfully created in db!");

    res.status(200).json({
        success: true
    })
});

app.get("/api/activities/month", verifyJWT, async (req, res) => {
    console.log("==> Retrieving user monthly activities...");
    const curr_date = new Date();
    const month_start = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1);
    const month_end = new Date(curr_date.getFullYear(), curr_date.getMonth() + 1, 0);
    const token = req.headers.authorization as string;
    const user = jwt.decode(token) as UserType;

    const month_activities = await Activity.find({
        user: user.email,
        created_at: {
            $gte: month_start,
            $lte: month_end,
        },
    }).sort({
        created_at: 1
    });

    console.log("==> Returning activities...");

    res.status(200).json({
        success: true,
        month_activities
    })
});

app.listen(port, () => {
    return console.log(`Express server is listening at http://localhost:${port} 🚀`);
});