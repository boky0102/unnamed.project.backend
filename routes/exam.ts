import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getExamByIdController, getExamBySubjectIdController, getExamController } from "../controllers/exam.controller";

export const examRouter = Router();

examRouter.get("/", authenticate, getExamController);
examRouter.get("/subject", authenticate, getExamBySubjectIdController);
examRouter.get("/:id", authenticate, getExamByIdController);
