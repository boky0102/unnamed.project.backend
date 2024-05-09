import express from 'express';
import { Request, Response } from 'express';
import { userRouter } from './routes/users';
import { defaultErrorHandler, httpExceptionHandler, logErrors } from './middleware/error.middleware';
import { authRouter } from './routes/auth';
import cors from 'cors';
import { devRouter } from './dev/dev.routes';
require('dotenv').config();


/*

    This file is used for modifying app behavior, it is separated
    from server startup beacuse instance of app is needed for
    integration tests.

*/


const app = express();

/* app.use(express.json()); */ // Parse incoming requests data

app.use(cors<Request>({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.urlencoded({
    extended: true
}));

if(process.env.APP_MODE === "dev"){
    app.disable('view cache');
}

app.set('view engine', "ejs");


app.use(logErrors); // middleware for logging errors
app.use(httpExceptionHandler); // middleware for handling http errors
app.use(defaultErrorHandler); // middleware for catching all other errors

app.use("/users", userRouter); //endpoint specified
app.use("/auth", authRouter);
app.use("/dev", devRouter);

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Route good");
});

export default app;