import { NextFunction, Request, Response } from "express";
import { getChoiceQuestion, getOpenQuestion, saveChoiceQuestion, saveOpenQuestion, validateOpenQuestionData } from "../services/question.services";
import { ChoiceQuestionData, OpenQuestionData } from "../Types/question.types";

import { HttpException } from "../Types/error";




export const postOpenQuestionController = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const questionData = req.body as OpenQuestionData;

        await saveOpenQuestion(questionData, req.userID!);

        res.status(201).send();
        

    }catch(error){
        next(error);
    }
}

export const postChoiceQuestionController = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const questionData = req.body as ChoiceQuestionData;


        await saveChoiceQuestion(questionData, req.userID);

    }catch(error){
        next(error);
    }
}

export const getOpenQuestionController = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const questionId = parseInt(req.params.id);
        if(questionId){
            const questionData = await getOpenQuestion(questionId)
            res.status(200).send(questionData);
        } else {
            throw new HttpException(400, "Bad request");
        }
        

    }catch(error){
        next(error);
    }
}

export const getChoiceQuestionController = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const questionId = parseInt(req.params.id);
        if(questionId){
            const questionData = await getChoiceQuestion(questionId);
            res.status(200).send(questionData);
        }else {
            throw new HttpException(400, "Bad request");
        }

    }catch(error){
        next(error);
    }
}