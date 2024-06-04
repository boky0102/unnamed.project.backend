import { HttpException } from "../Types/error";
import { Subject } from "../Types/subject.types";
import { pool } from "./db.services"

export const saveSubject = async (subject: string) => {

    if(await subjectExists(subject)){
        throw new HttpException(400, "Subject already exists in database");
    }

    if(subject.length < 4){
        throw new HttpException(400, "Subject name is too short");
    }

    const db = await pool.connect();
    const query = "INSERT INTO subject (name) VALUES ($1)";
    const values = [subject];
    await db.query(query, values);

    db.release();
}


export const subjectExists = async (subject: string) :Promise<boolean> => {
    const db = await pool.connect();
    const query = "SELECT * FROM subject WHERE LOWER(name) = LOWER($1)";
    const values = [subject]; 
    const dbResponse = await db.query<Subject>(query, values);
    db.release();

    if(dbResponse.rowCount) return true;
    else return false;

}


export const getSubjectsStartingWith = async (matcher: string) : Promise<Subject[]> => {
    const db = await pool.connect();

    const query = "SELECT * FROM subject WHERE LOWER(name) LIKE $1"
    const values = [`${matcher.toLocaleLowerCase()}%`];

    const dbResponse = await db.query<Subject>(query, values);
    db.release();

    if(!dbResponse.rows || dbResponse.rowCount === 0){
        throw new HttpException(404, "No subjects start with given string");
    }

    return dbResponse.rows;
}

export const deleteSubject = async (name: string) : Promise<void> => {
    const db = await pool.connect();


    const query = "DELETE FROM subject WHERE LOWER(name) = LOWER($1)";
    const values = [name];

    db.query(query, values);

    db.release();
}