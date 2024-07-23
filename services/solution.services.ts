import { DatabaseError } from "pg";
import { HttpException } from "../Types/error";
import { SolutionDB, SolutionDBCamelCase } from "../Types/solution.types";
import { pool } from "./db.services"

export const getSolution = async (solutionId: number) :Promise<SolutionDBCamelCase> =>  {
    const connection = await pool.connect();
    const query = `SELECT * FROM solution WHERE solution_id = ($1)`;
    const values =[solutionId];
    const dbRes = await connection.query<SolutionDB>(query, values);

    connection.release();

    if(dbRes.rowCount === 0 || dbRes.rowCount === null){
        throw new HttpException(404, "Solution with given id does not exist");
    }

    return {
        eid: dbRes.rows[0].eid,
        solutionId: dbRes.rows[0].solution_id,
        allowRandomReview: dbRes.rows[0].allow_random_review,
        score: dbRes.rows[0].score,
        shareUrl: dbRes.rows[0].share_url,
        passCode: dbRes.rows[0].pass_code,
        solvedBy: dbRes.rows[0].solved_by,
        checkedBy: dbRes.rows[0].checked_by,
        finished: dbRes.rows[0].finished
    };
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