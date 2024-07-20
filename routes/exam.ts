import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getExamController } from "../controllers/exam.controller";

export const examRouter = Router();

examRouter.get("/", authenticate, getExamController);