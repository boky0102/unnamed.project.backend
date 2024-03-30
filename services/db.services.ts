require('dotenv').config();
import { Pool, Client, Query, QueryResult } from 'pg';

// single pool instance that will be shared across all services
export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});

/*
    This is a function for initializing database. It will
    ease setup of db for people who still don't have it
    running. Moreover, it will ensure that all collaborators 
    have the same database schema. 
*/
export const initializeDB = async () => {
    try{

        const database = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        })   

        await database.connect();
        
        await database.query("DROP TABLE IF EXISTS Users");  // deleting table to make adding new fields easier

        // creates user table in the database
        await database.query(`
        CREATE TABLE Users(
            uid TEXT PRIMARY KEY NOT NULL,
            username TEXT NOT NULL,
            auth_token TEXT,
            field_of_study TEXT,
            contributions INT
        )`);
        
        await database.end();


        console.log("DB initialized successfully");

    }catch(error){
        console.log("Failed to create db, please check that you have .env file in project and that you have local postgres db running");
        console.log(error)
        process.exit(1);  //terminates node process (shuts down server if db is not created successfully)
    }
}

