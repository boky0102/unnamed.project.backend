import { HttpException } from "../Types/error";
import { ExamChoiceQuestion, ExamData, ExamDB, ExamOpenQuestion, ExamQuestion } from "../Types/exam.types";
import { pool } from "./db.services"
import { DatabaseError } from "pg";

export const generateExam = async (subjectId: number, openQuestionsNumber: number, choiceQuestionsNumber: number, userID: string) : Promise<ExamData> => {
    

    if(openQuestionsNumber > 50 || choiceQuestionsNumber > 50){
        throw new HttpException(400, "Number of questions is too big, maximum is 50 per question type");
    }

    const connection = await pool.connect();

    try{

        connection.query("BEGIN");

        const insertExamQuery = "INSERT INTO exam (uid, open_questions, choice_questions, sid) VALUES ($1, $2, $3, $4) RETURNING eid";
        const insertExamValues = [userID, openQuestionsNumber, choiceQuestionsNumber, subjectId];
        const examInsertResponse = await connection.query<ExamDB>(insertExamQuery, insertExamValues);

        if(examInsertResponse.rowCount === 0 || examInsertResponse.rowCount === null){
            throw new HttpException(500, "Error inserting new exam to exam table");
        }
        const examId =examInsertResponse.rows[0].eid;

        const openQuestionsQuery = `SELECT qid, question FROM questions
                    INNER JOIN open_question ON questions.oqid = open_question.oqid
                        WHERE questions.sid = ($1)
                            ORDER BY RANDOM()
                                LIMIT ($2)`
        const openQuestionsValues = [subjectId, openQuestionsNumber];
        const openQuestions = await connection.query<ExamOpenQuestion>(openQuestionsQuery, openQuestionsValues);

        if(openQuestions.rowCount === 0 || openQuestions.rowCount === null){
            throw new HttpException(404, "Subject id doesn't exist or there are no questions for given subject");
        }

        const choiceQuestionsQuery = `SELECT qid, question, answer1, answer2, answer3, answer4 FROM questions
                    INNER JOIN choice_question ON questions.cqid = choice_question.cqid
                        WHERE questions.sid = ($1)
                            ORDER BY RANDOM()
                                LIMIT ($2)`
        const choiceQUestionsValues = [subjectId, choiceQuestionsNumber];
        const choiceQuestions = await connection.query<ExamChoiceQuestion>(choiceQuestionsQuery, choiceQUestionsValues);

        if(choiceQuestions.rowCount === 0 || openQuestions.rowCount === null){
            throw new HttpException(404, "Subject id doesn't exist or there are no questions for given subject");
        }

        openQuestions.rows.forEach(async (question) => {
            const query = "INSERT INTO exam_question (eid, qid) VALUES ($1, $2)";
            const values = [examId ,question.qid];
            const res = await connection.query<ExamQuestion>(query, values)
        });

        choiceQuestions.rows.forEach(async (question) => {
            console.log(question);
            const query = "INSERT INTO exam_question (eid, qid) VALUES ($1, $2)";
            const values = [examId, question.qid];
            const res = await connection.query<ExamQuestion>(query,values);
        });



        connection.query("COMMIT;");

        return(
            {
                eid: examId,
                sid: subjectId,
                open_questions: openQuestions.rows,
                choice_questions: choiceQuestions.rows
            }
        )

    }catch(error){
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
/* 
export const createExam = async (userID: string, openQuestionsNumber: number, choiceQuestionsNumber: number, sid: number) => {
    const connection = await pool.connect();
    const query = "INSERT INTO exam (uid, open_questions, choice_questions, subject_id) VALUES ($1, $2, $3, $4) RETURNING eid";
    const values = [userID, openQuestionsNumber, choiceQuestionsNumber, sid];
}

export const saveExamQuestions = async () => {

}

export const getExamById = async (examID: number) => {
    const connection = await pool.connect();

    const query = `SELECT qid, question, answer1, answer2, answer3, answer4 FROM exam
                    INNER JOIN  question
                                `

    connection.release();
} */