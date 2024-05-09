import { NextFunction, Request, Response } from "express";
import { getTableNames } from "../services/admin.services";
import { pool } from "../services/db.services";
import { getObjectKeys } from "../utility/object.utility";
require("dotenv").config();

export const devController = async (req: Request, res: Response, next: NextFunction) => {
    try{

        res.status(200).render("index");



    }catch(error){
        next(error);
    }
}

export const devLoginController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {username, password} = req.body;

        if(password === process.env.DEV_PAGE_PASSWORD && username === process.env.DEV_PAGE_USERNAME){

            req.session.loggedIn = true;
            
            res.redirect("/dev/home")

        } else{
            res.send("Invalid data");
        }
    } catch(error){
        res.send("500, error");
    }
    
}

export const devMainController = async (req: Request, res: Response, next: NextFunction) => {

    try{

        const tables = await getTableNames();

        const data = {
            tableNames: tables
        }


        res.render("main.ejs", {
            data: data
        });
        
    } catch(error){
        next(error);
    }

}

export const devUserController = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const db = await pool.connect();
        const dbres = await db.query("SELECT * FROM users");
        const users = dbres.rows;
        db.release();

        const tableNames = await getTableNames();
        
        const columnNames = await getObjectKeys(users[0]);

        res.render("users", {
            data: {
                tableNames: tableNames,
                columnNames: columnNames,
                userData: users
            }
        })

    }catch(error){
        next(error);
    }
}

export const devOpenQuestionController = async (req: Request, res: Response, next: NextFunction) => {

    try{
        const db = await pool.connect();

        const dbres = await db.query("SELECT * FROM open_question");
        const openQuestions = dbres.rows;

        db.release();
        const tableNames = await getTableNames();

        const columnNames = await getObjectKeys(openQuestions[0]);

        res.render("open-question", {
            data: {
                tableNames: tableNames,
                columnNames: columnNames,
                questionData: openQuestions
            }
        })
    } catch(error){
        next(error);
    }
    

}

export const devQuestionController = async (req: Request, res: Response, next: NextFunction) => {

    try{
        const db = await pool.connect();

        const dbres = await db.query("SELECT * FROM questions");
        const questions = dbres.rows;

        db.release();
        const tableNames = await getTableNames();

        const columnNames = await getObjectKeys(questions[0]);

        res.render("questions", {
            data: {
                tableNames: tableNames,
                columnNames: columnNames,
                questionData: questions
            }
        })
    } catch(error){
        next(error);
    }
    

}

export const devChoiceQuestionController = async (req: Request, res: Response, next: NextFunction) => {

    try{
        const db = await pool.connect();

        const dbres = await db.query("SELECT * FROM choice_question");
        const questions = dbres.rows;

        db.release();
        const tableNames = await getTableNames();

        const columnNames = await getObjectKeys(questions[0]);

        res.render("choice-question", {
            data: {
                tableNames: tableNames,
                columnNames: columnNames,
                questionData: questions
            }
        })
    } catch(error){
        next(error);
    }
    

}

export const devSubjectController = async (req: Request, res: Response, next: NextFunction) => {

    try{
        const db = await pool.connect();

        const dbres = await db.query("SELECT * FROM subject");
        const subjects = dbres.rows;

        db.release();
        const tableNames = await getTableNames();

        const columnNames = await getObjectKeys(subjects[0]);

        res.render("subject", {
            data: {
                tableNames: tableNames,
                columnNames: columnNames,
                subjectData: subjects
            }
        })
    } catch(error){
        next(error);
    }
    

}

export const devExamController = async (req: Request, res: Response, next: NextFunction) => {

    try{
        const db = await pool.connect();

        const dbres = await db.query("SELECT * FROM exam");
        const exams = dbres.rows;

        db.release();
        const tableNames = await getTableNames();

        const columnNames = await getObjectKeys(exams[0]);

        res.render("exam", {
            data: {
                tableNames: tableNames,
                columnNames: columnNames,
                examData: exams
            }
        })
    } catch(error){
        next(error);
    }
    

}


export const devExamQuestionController = async (req: Request, res: Response, next: NextFunction) => {

    try{
        const db = await pool.connect();

        const dbres = await db.query("SELECT * FROM exam_question");
        const examsQuestions = dbres.rows;

        db.release();
        const tableNames = await getTableNames();

        const columnNames = await getObjectKeys(examsQuestions[0]);

        res.render("exam-question", {
            data: {
                tableNames: tableNames,
                columnNames: columnNames,
                examQuestionData: examsQuestions
            }
        })
    } catch(error){
        next(error);
    }
    

}






