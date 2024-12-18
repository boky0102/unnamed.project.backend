/*Here are all the endpoints related to Users
with an order of GET, POST, PATCH, DELETE*/
import { Router } from "express";
import { getUserController, getUsersController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { logoutController } from "../controllers/auth.controller";
require("dotenv").config();

export const userRouter = Router();

// get route for users, using userController
userRouter.get("/userdata", authenticate, getUserController);
userRouter.get("/logout", authenticate, logoutController);
