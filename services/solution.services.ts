import { DatabaseError } from "pg";
import { HttpException } from "../Types/error";
import { solutionAnswerDb, SolutionDB, SolutionDBCamelCase, SolutionExamData } from "../Types/solution.types";
import { pool } from "./db.services"
import { httpExceptionHandler } from "../middleware/error.middleware";
import { getExam } from "./exam.services";

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

export const saveAnswer = async (solutionId: number, qid: number, answer: string, type: "choice" | "open") => {


    const connection = await pool.connect();

    if(type === "choice"){
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
                 // update answer
            }
        } finally{
            connection.release();
        }
        
    }
}
