/*Here are all the endpoints related to Users
with an order of GET, POST, PATCH, DELETE*/
import { Pool } from 'pg'
import { Router } from "express";
import { pool } from '../services/db.services'
import { getUserController } from '../controllers/user.controller';
require('dotenv').config();

export const userRouter = Router();

// get route for users, using userController
userRouter.get('/', getUserController);

