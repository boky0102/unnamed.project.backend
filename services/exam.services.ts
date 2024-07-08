import { pool } from "./db.services"

export const generateExam = async (subjectId: number) => {
    const connection = await pool.connect();
    
    const dbRes = await connection.query("SELECT * FROM exam;");

    console.log(dbRes.rows);

}   