import { HttpException } from "../Types/error";
import { ExamChoiceQuestion, ExamData, ExamDB, ExamOpenQuestion, ExamQuestion } from "../Types/exam.types";
import { parseQID } from "../utility/database.utility";
import { pool } from "./db.services"
import { DatabaseError } from "pg";

export const generateExam = async (subjectId: number, openQuestionsNumber: number, choiceQuestionsNumber: number, userID: string) : Promise<ExamData> => {
    
    if(openQuestionsNumber > 50 || choiceQuestionsNumber > 50){
        throw new HttpException(400, "Number of questions is too big, maximum is 50 per question type");
    }

    const choiceQuestions = await getRandomChoiceQuestions(choiceQuestionsNumber, subjectId);
    const openQuestions = await getRandomOpenQuestions(openQuestionsNumber, subjectId);
    const qidArray = await parseQID(openQuestions, choiceQuestions);

    const connection = await pool.connect();

    try{
        connection.query("BEGIN");

        const insertExamQuery = "INSERT INTO exam (uid, open_questions, choice_questions, sid) VALUES ($1, $2, $3, $4) RETURNING eid";
        const insertExamValues = [userID, openQuestionsNumber, choiceQuestionsNumber, subjectId];
        const examInsertResponse = await connection.query<ExamDB>(insertExamQuery, insertExamValues);
        const examID = examInsertResponse.rows[0].eid;
        if(!examID){
            throw new HttpException(500, "Can't insert exam in database");
        }

        const insertExamQuestionsQuery = "INSERT into exam_question (qid, eid) (SELECT qid, ($1) as eid FROM questions WHERE questions.qid IN (" + qidArray.join(",") + "))";
        const insertExamQuestionsValues = [examID];
        await connection.query<ExamQuestion>(insertExamQuestionsQuery, insertExamQuestionsValues);

        connection.query("COMMIT;");

        return(
            {
                eid: examID,
                sid: subjectId,
                open_questions: openQuestions,
                choice_questions: choiceQuestions
            }
        )
    }
    catch(error){
        connection.query("ROLLBACK;");
        if(error instanceof DatabaseError){
            if(error.code === '23503'){ // code for foreign key violation -> subject id doesn't exist
                throw new HttpException(404, "Subject id doesn't exist or there are no questions for given subject");
            } 
        }
        console.log(error);
        throw error;
    } finally{
        connection.release();
    }

}   

export const getRandomOpenQuestions = async (n: number, sid: number) => {
    const connection = await pool.connect();

    const query = `SELECT qid, question FROM questions
                    INNER JOIN open_question ON questions.oqid = open_question.oqid
                        WHERE questions.sid = ($1)
                            ORDER BY RANDOM()
                                LIMIT ($2);`

    const values = [sid, n];

    const dbRes = await connection.query<ExamOpenQuestion>(query, values);
    connection.release();

    if(dbRes.rowCount === null || dbRes.rowCount === 0){
        throw new HttpException(404, "Subject id doesn't exist or there are no questions for given subject");
    }

    return dbRes.rows;
}

export const getRandomChoiceQuestions = async (n: number, sid: number) => {
    const connection = await pool.connect();

    const query = `SELECT qid, question, answer1, answer2, answer3, answer4 FROM questions
                    INNER JOIN choice_question ON questions.cqid = choice_question.cqid
                        WHERE questions.sid = ($1)
                            ORDER BY RANDOM()
                                LIMIT ($2);`
    
    const values = [sid, n];

    const dbRes = await connection.query<ExamChoiceQuestion>(query, values);

    connection.release();

    if(dbRes.rowCount === null || dbRes.rowCount === 0){
        throw new HttpException(404, "Subject id doesn't exist or there are no questions for given subject");
    }

    return dbRes.rows;

    
}