import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getExamByIdController, getExamController } from "../controllers/exam.controller";

export const examRouter = Router();

examRouter.get("/", authenticate, getExamController);
examRouter.get("/:id", authenticate, getExamByIdController);