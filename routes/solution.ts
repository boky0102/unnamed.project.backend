import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getSolutionController, getAllSolutionsController, generateSolutionController, saveSolutionAnswerController, commitSolutionController } from "../controllers/solution.controller";

export const solutionRouter = Router();


solutionRouter.get("/", authenticate, getAllSolutionsController);
solutionRouter.get("/:id" , authenticate , getSolutionController);
solutionRouter.post("/generate", authenticate, generateSolutionController);
solutionRouter.post("/save-answer", authenticate, saveSolutionAnswerController);
solutionRouter.post("/commit/:solutionid", authenticate, commitSolutionController);