import { NextFunction, Request, Response } from "express";
import { getSolution } from "../services/solution.services";
import { HttpException } from "../Types/error";

export const getSolutionController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const solutionId = req.params.id;
        if(solutionId && typeof(solutionId) === "string" && !Number.isNaN(parseInt(solutionId))){
            const solutionData = await getSolution(parseInt(solutionId));
            res.status(200).json(solutionData).send();
        } else {    
            throw new HttpException(400, "Bad request, please provide solution id in url");
        }
        
    }catch(error){
        next(error);
    }
}