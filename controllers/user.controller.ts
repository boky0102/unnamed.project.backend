import { Request, Response, NextFunction } from "express";
import { getAllUsers } from "../services/user.service";

//user controller
export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const users = await getAllUsers();
        res.json(users);
    }catch(error){
        next(error);
    }
}