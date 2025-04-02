import path from "path";
import express from "express";
import crypto from "crypto";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import { router as apiRouter } from "./routers/api";
import { User } from "./models/users.model";

export const app = express();

app.use((req, _, next) => {
    console.log((new Date()).toLocaleString(), req.method, req.url);
    next();
});

app.use(json());
app.use(cookieParser(process.env.SESSION_SECRET));
const hashKey = process.env.HASH_SECRET || "defaultKey";

app.all("/login", (req, res, next) => {
    if (req.signedCookies.userId) {
        res.redirect("/");
        return;
    }

    next();
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const credentials  = await User.find({email: email},{email: true, password: true});
    console.log(credentials);
    const hashedPassword = crypto.createHmac("sha256", hashKey).update(password).digest("hex");

    if (email !== credentials[0].email || hashedPassword !== credentials[0].password) {
        res.status(401);
        res.send("Wrong credentials");
        return;
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    console.log(credentials[0]._id);
    
    res.cookie("userId", credentials[0]._id, {
        expires,
        signed: true,
        httpOnly: true,
    });

    res.end();
});

app.get("/logout", async (req, res) => {
    res.clearCookie("userId", { httpOnly: true, signed: true });
    res.send("Logged out successfully.");
});

app.post("/register", async (req, res) => {
    const { email, password, name } = req.body;

    const users  = await User.find({email: email},{email: true});
    if (users.length > 0){
        res.status(401);
        res.send(`user with email ${email} already exists.`);
        return;
    }
    
    const hashedPassword = crypto.createHmac("sha256", hashKey).update(password).digest("hex");

    try {     

        const createdUser = await User.create({
            email,
            password: hashedPassword,
            name,
        });

        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        res.cookie("userId", createdUser._id, {
            expires,
            signed: true,
            httpOnly: true,
        });

        res.status(201);
        res.end();
    } catch (error) {
        console.error(error);

        res.status(500);
        res.send("Oops, something went wrong");
    }
});

app.use("/api", apiRouter);
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use((_, res) => {
    res.redirect("404.html");
});