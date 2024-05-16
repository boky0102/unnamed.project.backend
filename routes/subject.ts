import { Router } from "express";
import { searchSubjectsController } from "../controllers/subject.controller";
import { authenticate } from "../middleware/auth.middleware";

export const subjectRouter = Router();

subjectRouter.get("/", authenticate ,searchSubjectsController);