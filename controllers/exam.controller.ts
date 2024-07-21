import { NextFunction, Request, Response } from "express";
import { HttpException } from "../Types/error";
import { generateExam, getExam, getExamsBySubjectId } from "../services/exam.services";

export const getExamController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const queryParams = req.query;

        if( (queryParams.sid !== undefined && queryParams.open !== undefined && queryParams.choice !== undefined) &&
            typeof queryParams.sid === "string" &&
            typeof queryParams.open === "string" &&
            typeof queryParams.choice === "string"
        ){
            const sid = parseInt(queryParams.sid);
            const openQuestionsNumber = parseInt(queryParams.open);
            const choiceQuestionsNumber = parseInt(queryParams.choice);
            const examData = await generateExam(sid, openQuestionsNumber, choiceQuestionsNumber, req.userID);
            res.status(200).send(examData);
        } else {
            throw new HttpException(400, "Bad request parameters, make sure to include subject id, number of open-ended questions and number of choice questions");
        }
        
        
    }catch(error){
        next(error);
    }
}

export const getExamByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const id = req.params.id;
        if(!id){
            throw new HttpException(400, "No required parameter in the url");
        } else {
            const examData = await getExam(parseInt(id));
            res.status(200).send(examData);
        }

    }catch(error){
        next(error);
    }
}

export const getExamBySubjectIdController = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const { subjectid, page, limit } = req.query;
        if((subjectid && page && limit)
            && typeof subjectid === "string"
            && typeof page === "string"
            && typeof limit === "string"
        ){

            const exams = await getExamsBySubjectId(parseInt(subjectid), parseInt(page), parseInt(limit));
            res.status(200).send(exams);

        }else{
            throw new HttpException(400, "Bad request, url parameters are not valid")
        }

    }catch(error){
        next(error);
    }
}