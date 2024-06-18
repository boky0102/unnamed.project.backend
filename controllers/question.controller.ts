import { NextFunction, Request, Response } from "express";
import { saveOpenQuestion, validateOpenQuestionData } from "../services/question.services";
import { HttpException } from "../Types/error";




export const postOpenQuestionController = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const questionData = req.body as OpenQuestionData;

        await saveOpenQuestion(questionData, req.userID!);
        

    }catch(error){
        next(error);
    }
}