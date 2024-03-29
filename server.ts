require('dotenv').config();
import express from 'express';
import { Request, Response } from 'express';
import { userRouter } from './routes/users';
import { defaultErrorHandler, httpExceptionHandler, logErrors } from './middleware/error.middleware';


const app = express();

app.use(express.json()); // Parse incoming requests data

app.use(logErrors); // middleware for logging errors
app.use(httpExceptionHandler); // middleware for handling http errors
app.use(defaultErrorHandler); // middleware for catching all other errors

app.use("/users", userRouter); //endpoint specified

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Route good");
})

app.listen(3000, () => {
    console.log("server is running on 3000");
})