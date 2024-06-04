import { NextFunction, Request, Response } from "express"
import { Subject } from "../Types/subject.types"
import { getSubjectsStartingWith, saveSubject } from "../services/subject.services"
import { HttpException } from "../Types/error"

export const searchSubjectsController = async (req: Request, res: Response, next: NextFunction) => {


    try{
        if(!req.query.query){
            throw new HttpException(400, "Bad query parameter");
        }
        const subjects: Subject[] = await getSubjectsStartingWith(req.query.query as string);


        res.status(200).json(subjects);

    } catch(error){
        next(error);
    }
    
}

export const postSubjectController = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const subject = req.body.subject;
        await saveSubject(subject);
        res.status(201).send();

    }catch(error){
        next(error);
    }
}