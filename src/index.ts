// imports
import express, { Router } from "express";
import serverless from "serverless-http";
import { getAuth } from "firebase-admin/auth";
import { firebaseApp } from "../firebase";
import cors from "cors";
import { getAppCheck } from "firebase-admin/app-check";

// initial config
const api = express();
const router = Router();
firebaseApp;

// cors
const corsOptions = {
}
api.use(cors(corsOptions));

// firebase auth token verification
api.use(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            await getAuth().verifyIdToken(authHeader.split(' ')[1]);
            next();
        } catch (error) {
            res.status(401).send(error);
        }
    } else {
        res.sendStatus(400);
    }
})

// firebase app check verification
api.use(async (req, res, next) => {
    const appCheckToken = req.header("X-Firebase-AppCheck");
    if (appCheckToken) {
        try {
            const check = await getAppCheck().verifyToken(appCheckToken, { consume: true });
            if (check.alreadyConsumed) {
                res.status(401).send('Token already consumed');
            } else {
                next();
            }
        } catch (err) {
            res.status(401).send(err);
        }
    } else {
        res.sendStatus(400);
    }
});

// apis
router.post("/notify", async (req, res) => {
    try {
        const receivedText = Buffer.from(req.body).toString();
        const response = await fetch(process.env.WEBHOOK as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": "manage.icepcp.com",
                "content": receivedText
            })
        });
        if (!response.ok) {
            res.status(response.status).send(response.statusText);
        } else {
            res.sendStatus(200);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// export
api.use("/", router);
export const handler = serverless(api);
