import { HttpException } from "../Types/error";
import { pool } from "./db.services";

export const validateOpenQuestionRequestData = async (questionData: Object) => {
    if(!questionData.hasOwnProperty("question") ||  !questionData.hasOwnProperty("sid")){
        return false;
    } else {
        return true;
    }
}

export const validateOpenQuestionData = async (questionData: OpenQuestionData) => {
    if(questionData.question.length < 10) return false;
    return true;
}

export const saveOpenQuestion = async (questionData: OpenQuestionData) => {

    if(await validateOpenQuestionRequestData(questionData) && await validateOpenQuestionData(questionData)){
        const conn = await pool.connect();

        const query = "INSERT INTO open_question (question, sid) VALUES ($1, $2) RETURNING oqid";

        const values = [questionData.question, questionData.sid];

        const oqid = await conn.query<OpenQuestion>(query, values);

        return oqid.rows[0].oqid;
    } else {
        throw new HttpException(400, "Bad request");
    }

}