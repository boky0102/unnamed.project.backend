import express from 'express';
import { Request, Response } from 'express';

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Route good");
})

app.listen(3000 ,() => {
    console.log("SERVER IS RUNNING ON PORT 3000")
})