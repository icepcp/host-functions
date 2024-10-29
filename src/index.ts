// imports
import express, { Router } from "express";
import serverless from "serverless-http";
import cors from "cors";
import verifyToken from "../verify";

// initial config
const api = express();
const router = Router();

// cors
const corsOptions = {
}
api.use(cors(corsOptions));

// verification
api.use(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const { error } = await verifyToken(authHeader)
        if (error) {
            res.sendStatus(401);
        } else {
            next();
        };
    } else {
        res.sendStatus(400);
    }
})

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
