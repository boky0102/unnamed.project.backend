import { Request, Response, NextFunction } from "express";
import { getAllUsers, getUser } from "../services/user.services";
import { HttpException } from "../Types/error";

//user controller
export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const users = await getAllUsers();
        res.json(users);
    }catch(error){
        next(error);
    }
}

export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.userID;
        console.log(userId);
        if(!userId){
            throw new HttpException(401, "Unauthorized");
        }else {
            const userData = await getUser(userId);
            res.status(200).send(userData);
        }
        
    }catch(error){
        next(error);
    }
}