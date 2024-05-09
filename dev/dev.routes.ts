import router, { NextFunction, Request, Response } from "express";
import express from "express";
import { devChoiceQuestionController, devController, devExamController, devExamQuestionController, devLoginController, devMainController, devOpenQuestionController, devQuestionController, devSubjectController, devUserController } from "./dev.controller";
import { authenticateDev } from "./dev.middleware";
import session from "express-session";
require("dotenv").config();

export const devRouter = router();

devRouter.use(express.urlencoded({extended: false}));

devRouter.use((req: Request, res: Response, next: NextFunction) => {
    res.set('Cashe-Control', 'no-store')
    next();
})


devRouter.use(session({
    name: "name",
    secret: process.env.SESS_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        path: "/dev",
        maxAge: 1000 * 60 * 60
    }

}))

devRouter.get("/", devController);

devRouter.post("/auth", devLoginController)

devRouter.get("/home", authenticateDev ,devMainController);

devRouter.get("/users", authenticateDev, devUserController);

devRouter.get("/open_question", authenticateDev, devOpenQuestionController);

devRouter.get("/questions", authenticateDev, devQuestionController);

devRouter.get("/choice_question", authenticateDev, devChoiceQuestionController);

devRouter.get("/subject", authenticateDev, devSubjectController);

devRouter.get("/exam", authenticateDev, devExamController);

devRouter.get("/exam_question", authenticateDev, devExamQuestionController);