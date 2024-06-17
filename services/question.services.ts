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

            console.log(`question = ${questionData.question}, sid = ${questionData.sid}, uid = ${userId}, opqid = ${dbResponse.rows[0].oqid}`)

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