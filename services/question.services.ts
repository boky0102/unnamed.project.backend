import { HttpException } from "../Types/error";
import { log } from "../utility/logger.utility";
import { pool } from "./db.services";

export const validateOpenQuestionRequestData = async (questionData: Object) => {
    if(!questionData.hasOwnProperty("question") ||  !questionData.hasOwnProperty("sid")){
        return false;
    } else {
        return true;
    }
}

export const validateOpenQuestionData = async (questionData: OpenQuestionData) => {
    if(questionData.question.length < 10 && questionData.sid) return false;
    return true;
}

export const saveOpenQuestion = async (questionData: OpenQuestionData, userId: string) => {

    if(await validateOpenQuestionRequestData(questionData) && await validateOpenQuestionData(questionData)){
        const conn = await pool.connect();

        try{
            
            await conn.query("BEGIN");

            const queryText = "INSERT INTO open_question (question, sid) VALUES ($1, $2) RETURNING oqid";
            const queryValues = [questionData.question, questionData.sid];
            const dbResponse = await conn.query<OpenQuestion>(queryText, queryValues);

            const questionQuery = "INSERT INTO questions (uid, sid, oqid) VALUES ($1, $2, $3) RETURNING qid";
            const questionValues = [userId, questionData.sid, dbResponse.rows[0].oqid];
            const dbRes = await conn.query<Question>(questionQuery, questionValues);

            await conn.query("COMMIT");

            return dbRes.rows[0].qid;


        }catch(error){
            await conn.query("ROLLBACK");
            throw error;
        } finally{
            conn.release();
        }

    } else {
        throw new HttpException(400, "Bad request");
    }

}

export const validateChoiceQuestionPostData = async (questionData: ChoiceQuestionData) => {

    if(questionData.question.length < 10) return false;
    if(!questionData.answer1 || !questionData.answer2 || !questionData.answer3 || !questionData.answer4) return false;
    if(questionData.solution < 1 || questionData.solution > 4) return false;
    if(!questionData.sid || !questionData.solution) return false

    return true;
}

export const saveChoiceQuestion = async (questionData: ChoiceQuestionData, userId: string) => {

    if(await validateChoiceQuestionPostData(questionData)){
        const conn = await pool.connect();

        try{

            await conn.query("BEGIN");

            const choiceQuestionQuery = "INSERT INTO choice_question (question, answer1, answer2, answer3, answer4, solution, sid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING cqid";
            const choiceQuestionValues = [questionData.question, questionData.answer1, questionData.answer2, questionData.answer3, questionData.answer4, questionData.solution, questionData.sid];
            const dbRes1 = await conn.query<ChoiceQuestion>(choiceQuestionQuery, choiceQuestionValues);

            const questionQuery = "INSERT INTO questions (uid, sid, cqid) VALUES ($1, $2, $3) RETURNING qid"
            const questionValues = [userId, questionData.sid, dbRes1.rows[0].cqid];
            const dbRes2 = await conn.query<Question>(questionQuery, questionValues);

            await conn.query("COMMIT");
            return dbRes2.rows[0].qid;


        }catch(error){
            await conn.query("ROLLBACK");
            throw error;
        }finally{
            conn.release();    
        }
    } else {
        throw new HttpException(400, "Bad choice question data provided");
    }

    

}