import { DatabaseError } from "pg";
import { HttpException } from "../Types/error";
import { solutionAnswerDb, SolutionAnswerObject, SolutionChoiceAnswer, SolutionDB, SolutionDBCamelCase, SolutionExamData, SolutionReviewElement } from "../Types/solution.types";
import { pool } from "./db.services"
import { getExam } from "./exam.services";
import { getChoiceQuestionAnswers } from "./question.services";
import { ChoiceQuestionAnswer } from "../Types/question.types";

export const getSolution = async (solutionId: number) : Promise<SolutionExamData> => {
    const connection = await pool.connect();
    const query = `SELECT * FROM solution WHERE solution_id = ($1)`;
    const values =[solutionId];
    const dbRes = await connection.query<SolutionDB>(query, values);

    connection.release();

    if(dbRes.rowCount === 0 || dbRes.rowCount === null){
        throw new HttpException(404, "Solution with given id does not exist");
    } else {

        const examData = await getExam(dbRes.rows[0].eid);

        return {
            eid: dbRes.rows[0].eid,
            solutionId: dbRes.rows[0].solution_id,
            allowRandomReview: dbRes.rows[0].allow_random_review,
            score: dbRes.rows[0].score,
            shareUrl: dbRes.rows[0].share_url,
            passCode: dbRes.rows[0].pass_code,
            solvedBy: dbRes.rows[0].solved_by,
            checkedBy: dbRes.rows[0].checked_by,
            finished: dbRes.rows[0].finished,
            startedAt: dbRes.rows[0].started_at,
            examData: examData
        };

    }

    
}

export const getSolutionsByUserId = async (userId: string) : Promise<SolutionDBCamelCase[]> => {
    const connection = await pool.connect();
    const query = `SELECT   solution_id AS "solutionId",
                            solution.eid,
                            allow_random_review AS "allowRandomReview",
                            score,
                            share_url AS "shareUrl",
                            pass_code AS "passCode",
                            solved_by AS "solvedBy",
                            checked_by AS "checkedBy",
                            started_at AS "startedAt",
                            finished,
                            subject.name AS "subjectName"
                    FROM solution
                    INNER JOIN exam ON exam.eid = solution.eid
                    INNER JOIN subject ON exam.sid = subject.sid
                    WHERE solution.solved_by = ($1)
    `
    const values = [userId];
    const dbRes = await connection.query<SolutionDBCamelCase>(query, values);
    connection.release();

    if(dbRes.rowCount === 0 || dbRes.rowCount === null){
        throw new HttpException(404, "There are no solutions made by given user");
    } else {
        return dbRes.rows;
    }
}


export const generateSolution = async (examId: number, solverUserId: string, randomReviewer: boolean) => {

    const connection = await pool.connect();
    const query = `INSERT INTO solution (eid, allow_random_review, solved_by) VALUES ($1, $2, $3) RETURNING solution_id`;
    const values = [examId, randomReviewer, solverUserId];
    try{   
        const { rows, rowCount } = await connection.query<{solution_id: number}>(query, values);
        connection.release();
        if(rowCount === 0 || rowCount === null){
            throw new HttpException(500, "Solution could not be created with given parameters");
        } else {
            return rows[0].solution_id
        }
        
    } catch(error){
        connection.release();
        if(error instanceof DatabaseError){
            if(error.code === '23503'){
                throw new HttpException(400, "Exam or user with given id does not exist");
            } else {
                throw new HttpException(500, "Query was not possilbe");
            }
        } else{
            throw error
        }
    }
    
}

export const commitSolution = async (solutionId: number, userId: string) => {

    const connection = await pool.connect();

    const examIdQuery = "SELECT eid FROM solution WHERE solution_id = ($1) AND solved_by = ($2)";
    const examValues = [solutionId, userId];
    const examIdDbRes = await connection.query<{eid: number}>(examIdQuery, examValues);

    if(examIdDbRes.rowCount === 0 || examIdDbRes.rowCount === null){
        connection.release();
        throw new HttpException(404, "Can't find exam with given solution id");
    } else {
        
        const choiceQuestionAnswers = await getChoiceQuestionAnswers(examIdDbRes.rows[0].eid);

        const userChoiceQuestionAnswers = await getSolutionChoiceQuestions(solutionId);

        if(choiceQuestionAnswers){
            for(const goodAnswer of choiceQuestionAnswers){
                let query = "";
                if(userChoiceQuestionAnswers[goodAnswer.qid] === goodAnswer.solution.toString()){
                    query = "UPDATE solution_answer SET correct = TRUE WHERE solution_id = ($1) AND qid = ($2)";
                }else{
                    query = "UPDATE solution_answer SET correct = FALSE WHERE solution_id = ($1) AND qid = ($2)";
                }
                const values = [solutionId, goodAnswer.qid];
                const dbRes = await connection.query(query, values);
            }
        }

        const query = "UPDATE solution SET finished = '1' WHERE solution_id = ($1) AND solved_by = ($2)";
        const values = [solutionId, userId];

        const dbRes = await connection.query<any>(query, values);

        connection.release();
    }
    

}

export const saveAnswer = async (solutionId: number, qid: number, answer: string, userId : string) => {


    const connection = await pool.connect();

    const query = "SELECT finished FROM solution WHERE solution_id = ($1) AND solved_by = ($2)";
    const values = [solutionId, userId];
    const dbRes = await connection.query<{finished: boolean}>(query, values);

    if(dbRes.rowCount === null || dbRes.rowCount !== 1){
        connection.release();
        throw new HttpException(400, "Solution with given id does not exist");
    } else {
        const completed = dbRes.rows[0].finished;
        if(completed){
            connection.release();
            throw new HttpException(400, "Solution with given id has already been solved");
            
        } else {
    
            const query = "INSERT INTO solution_answer (solution_id, qid, user_answer) VALUES ($1, $2, $3);";
            const values = [solutionId, qid, answer];
    
            try{
                const dbRes = await connection.query<solutionAnswerDb>(query, values);
                return true;
            } catch(error){
                if(error instanceof DatabaseError){
                    if(error.code === "23505"){ // composite primary key already exists
                        try{
                            const query = "UPDATE solution_answer SET user_answer = ($1) WHERE solution_id = ($2) AND qid = ($3)";
                            const values = [answer, solutionId, qid];
                            const dbRes = await connection.query<solutionAnswerDb>(query, values);
                            return true;
                        }catch(error){
                            console.log(error);
                            throw new HttpException(500, "Error updating answers solution");
                        }
                    } else{
                        throw new HttpException(400, "Invalid given parameters, given solutionId or qid don't exist in the db");
                    }
                }
            } finally{
                connection.release();
            }
            
        
        }
    }
    
}

export const getSolutionChoiceQuestions = async (solutionId: number) :Promise<SolutionAnswerObject> => {
    const connection = await pool.connect();
    const query = `SELECT solution_answer.qid, user_answer FROM solution_answer
                    INNER JOIN questions ON questions.qid = solution_answer.qid
                    WHERE questions.cqid IS NOT NULL AND solution_answer.solution_id = ($1)`;
    const values = [solutionId];

    const { rows } = await connection.query<SolutionChoiceAnswer>(query, values);

    connection.release();

    const rowsObject = rows.reduce((agg, curr) => {
        return {
            ...agg,
            [curr.qid] : curr.user_answer
        }
    }, {})
    

    return rowsObject;
}

export const getSolutionUserAnswers = async (solutionId: number) => {
    const connection = await pool.connect();
    const query = "SELECT * FROM solution_answer WHERE solution_id = ($1)";
    const values = [solutionId];
    const dbRes = await connection.query<solutionAnswerDb>(query, values);
    connection.release();

    if(dbRes.rowCount === 0 || dbRes.rowCount === null){
        throw new HttpException(404, "Can't find solution asnwers for given solution id");
    } else {
        const answersObject : SolutionAnswerObject = dbRes.rows.reduce((agg, curr) => {
            return {
                ...agg,
                [curr.qid] : {
                    correct: curr.correct,
                    userAnswer: curr.user_answer
                }
            }
        }, {});

        return answersObject;

    }
}


// needs testing and expansion
export const reviewAnswers = async (solutionId: number, solutionReviews: SolutionReviewElement[]) => {
    const connection = await pool.connect();
    for(const questionData of solutionReviews){
        const query = "UPDATE solution_answer SET correct = ($1) WHERE solution_answer.qid = ($2) AND solution_answer.solution_id = ($3)";
        const values = [questionData.correct, questionData.qid, solutionId];
        const dbRes = await connection.query<any>(query, values);
    }

    connection.release();
}