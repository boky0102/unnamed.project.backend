import { NextFunction, Request, Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getSolutionController } from "../controllers/solution.controller";

export const solutionRouter = Router();

solutionRouter.get("/:id" , authenticate , getSolutionController);