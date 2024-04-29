require('dotenv').config();
import { Pool, Client } from 'pg';

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


        // drops all databases that exist !!!For development only, in production this will be turned off
        // enables easy reconfiguration of database schema while developing
        await database.query("DROP TABLE IF EXISTS exam_question");
        await database.query("DROP TABLE IF EXISTS exam");
        await database.query("DROP TABLE IF EXISTS questions");
        await database.query("DROP TABLE IF EXISTS open_question");
        await database.query("DROP TABLE IF EXISTS choice_question");
        await database.query("DROP TABLE IF EXISTS subject");
        await database.query("DROP TABLE IF EXISTS users");

        // creates user table in the database
        await database.query(`
            CREATE TABLE users(
                uid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                username TEXT NOT NULL,
                auth_token TEXT,
                field_of_study TEXT,
                contributions INT
            );`);

        // creates subject table in database
        await database.query(`
            CREATE TABLE subject(
                            sid SERIAL PRIMARY KEY,
                            name VARCHAR(100)
            );
        `)

        // creates choice_question table in database
        await database.query(`
            CREATE TABLE choice_question(
            cqid SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            answer1 TEXT NOT NULL,
            answer2 TEXT NOT NULL,
            answer3 TEXT NOT NULL,
            answer4 TEXT NOT NULL,
            solution INT NOT NULL,
            rating INT,
            sid SERIAL
            );
        `);

        //creates open_question table in database
        await database.query(`
            CREATE TABLE open_question(
            oqid SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            rating INT,
            sid SERIAL
            );
        `);

        //creates questions table in database
        await database.query(`
            CREATE TABLE questions(
            qid SERIAL PRIMARY KEY ,
            uid uuid NOT NULL,
            sid SERIAL NOT NULL,
            oqid SERIAL,
            cqid SERIAL,
            CONSTRAINT fk_open
                FOREIGN KEY (oqid)
                    REFERENCES open_question(oqid),

            CONSTRAINT fk_choice
                FOREIGN KEY (cqid)
                    REFERENCES choice_question(cqid),


            CONSTRAINT fk_uid
                FOREIGN KEY (uid)
                    REFERENCES users(uid),

            CONSTRAINT fk_subject
                FOREIGN KEY (sid)
                    REFERENCES subject(sid)
            );
        `);

        // creates exam table in database
        await database.query(`
            CREATE TABLE exam(
            eid SERIAL PRIMARY KEY,
            uid uuid,
            score INT,
            open_questions INT,
            choice_questions INT,
            subject_id SERIAL NOT NULL,
            CONSTRAINT fk_uid
                FOREIGN KEY (uid)
                    REFERENCES users(uid)
            );
        `);

        // creates exam_question table in database
        await database.query(`
            CREATE TABLE exam_question(
            eid SERIAL NOT NULL,
            qid SERIAL NOT NULL,
            PRIMARY KEY (eid, qid),
            CONSTRAINT fk_exam
                FOREIGN KEY (eid)
                    REFERENCES exam(eid),
            CONSTRAINT fk_question
                FOREIGN KEY (qid)
                    REFERENCES questions(qid)
            );
        `);

        //closes database
        await database.end();


        console.log("DB initialized successfully");

    }catch(error){
        console.log("Failed to create db, please check that you have .env file in project and that you have local postgres db running");
        console.log(error)
        process.exit(1);  //terminates node process (shuts down server if db is not created successfully)
    }
}



