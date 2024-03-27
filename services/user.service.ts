import { pool } from "./db.services"
import { User } from "../Types/userType";

// service for getting data for user from db
export const getAllUsers = async (): Promise<User[]> => {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Users');
    const users = result.rows;
    client.release();
    return users;
}