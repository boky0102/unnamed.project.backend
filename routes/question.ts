import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getChoiceQuestionController, getOpenQuestionController, postChoiceQuestionController, postOpenQuestionController } from "../controllers/question.controller";

export const questionRouter = Router();

questionRouter.get("/open-ended/:id", authenticate, getOpenQuestionController);
questionRouter.get("/choice/:id", authenticate, getChoiceQuestionController);
questionRouter.post("/open-ended", authenticate, postOpenQuestionController);
questionRouter.post("/choice", authenticate, postChoiceQuestionController);
