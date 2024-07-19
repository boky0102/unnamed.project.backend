import { ExamChoiceQuestion, ExamData, ExamOpenQuestion } from "../Types/exam.types";
import { pool } from "./db.services"

export const generateExam = async (subjectId: number, openQuestionsNumber: number, choiceQuestionsNumber: number) : Promise<ExamData> => {
    
    const openQuestions = await getRandomOpenQuestions(openQuestionsNumber, subjectId);
    const choiceQuestions = await getRandomChoiceQuestions(choiceQuestionsNumber,  subjectId);

    const examData: ExamData = {
       open_questions: openQuestions,
       choice_questions: choiceQuestions 
    }

    return examData;

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

    return dbRes.rows;

    
}