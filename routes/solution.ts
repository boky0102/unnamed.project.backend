import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getSolutionController, getAllSolutionsController, generateSolutionController } from "../controllers/solution.controller";

export const solutionRouter = Router();


solutionRouter.get("/", authenticate, getAllSolutionsController);
solutionRouter.get("/:id" , authenticate , getSolutionController);
solutionRouter.post("/generate", authenticate, generateSolutionController);