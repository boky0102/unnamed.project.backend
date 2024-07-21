import { HttpException } from "../Types/error";
import { ExamChoiceQuestion, ExamData, ExamDB, ExamID, ExamInfoData, ExamOpenQuestion, ExamPagableData, ExamPrettyData, ExamQuestion } from "../Types/exam.types";
import { parseQID } from "../utility/database.utility";
import { pool } from "./db.services"
import { DatabaseError } from "pg";

export const generateExam = async (subjectId: number, openQuestionsNumber: number, choiceQuestionsNumber: number, userID: string) : Promise<ExamData> => {
    
    if(openQuestionsNumber > 50 || choiceQuestionsNumber > 50){
        throw new HttpException(400, "Number of questions is too big, maximum is 50 per question type");
    } else if(openQuestionsNumber === 0 && choiceQuestionsNumber === 0){
        throw new HttpException(400, "Number of both open-ended and choice questions can not be 0");
    } else if (openQuestionsNumber < 0 || openQuestionsNumber < 0){
        throw new HttpException(400, "Number of any questions can not be negative");
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
        const insertExamQuestionsValues = [examID

        ];
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

    if(dbRes.rowCount === null || dbRes.rowCount === 0 && n !== 0){
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

    if(dbRes.rowCount === null || dbRes.rowCount === 0 && n !== 0){
        throw new HttpException(404, "Subject id doesn't exist or there are no questions for given subject");
    }

    return dbRes.rows;

    
}

export const getExam = async (examID: number) : Promise<ExamPrettyData> => {
    const connection = await pool.connect();
    if(!examID) console.log("Not a number")

    const examInfoQuery = `SELECT eid, subject.name, uid, open_questions, choice_questions FROM exam INNER JOIN subject ON exam.sid = subject.sid WHERE exam.eid = ($1)`;
    const examInfoValues = [examID];
    const examData = await connection.query<ExamInfoData>(examInfoQuery, examInfoValues);
    if(examData.rowCount === 0 || examData.rowCount === null){
        connection.release();
        throw new HttpException(404, "Exam with given id wasn't found");
    }

    const openQuestionsQuery = `SELECT questions.qid, question FROM exam
                                    INNER JOIN exam_question ON exam.eid = exam_question.eid
                                    INNER JOIN questions ON exam_question.qid = questions.qid
                                    INNER JOIN open_question ON questions.oqid = open_question.oqid
                                        WHERE exam.eid = ($1);`;
    const openQuestionValues = [examID];
    const examOpenQuestions = await connection.query<ExamOpenQuestion>(openQuestionsQuery, openQuestionValues);

    const choiceQuestionsQuery = `SELECT questions.qid, question, choice_question.answer1, choice_question.answer2, choice_question.answer3, choice_question.answer4, choice_question.solution FROM exam
                                    INNER JOIN exam_question ON exam.eid = exam_question.eid
                                    INNER JOIN questions ON exam_question.qid = questions.qid
                                    INNER JOIN choice_question ON questions.cqid = choice_question.cqid
                                        WHERE exam.eid = ($1);`
    const choiceQuestionsValues = [examID];
    const examChoiceQuestions = await connection.query<ExamChoiceQuestion>(choiceQuestionsQuery, choiceQuestionsValues);

    connection.release();
    return {
        eid: examData.rows[0].eid,
        subjectName: examData.rows[0].name,
        uid: examData.rows[0].uid,
        choice_questions: examData.rows[0].choice_questions,
        open_questions: examData.rows[0].open_questions,
        openQuestionData: examOpenQuestions.rows,
        choiceQuestionData: examChoiceQuestions.rows
    }
}

export const getExamsBySubjectId = async (subjectID: number, page: number, itemsOnPage: number) :Promise<ExamPagableData> => {

    if(page < 1 || itemsOnPage < 1){
        throw new HttpException(400, "Bad request, page number and items per page must be positive numbers");
    }

    console.log(typeof subjectID, typeof page, typeof itemsOnPage);

    const connection = await pool.connect();
    const offset = itemsOnPage * (page - 1);
    const examQuery = `SELECT eid FROM exam INNER JOIN subject ON exam.sid = subject.sid WHERE subject.sid = ($1) LIMIT ($2) OFFSET ($3)`;
    const examValues = [subjectID, itemsOnPage, offset];
    const examIDS = await connection.query<ExamID>(examQuery, examValues);

    if(examIDS.rowCount === 0 || examIDS.rowCount === null){
        connection.release();
        throw new HttpException(404, "Exam with given subject id is not found or there are no results for the given page");
    }

    const examsArray = [] as ExamPrettyData[];

    for(const examID of examIDS.rows){
        console.log(examID);
        const examData = await getExam(examID.eid);
        examsArray.push(examData);
    }



    connection.release();

    return {
        sid: subjectID,
        page: page,
        pageLimit: itemsOnPage,
        exams: examsArray
    }
}