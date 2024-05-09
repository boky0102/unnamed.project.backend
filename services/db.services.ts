import {User} from "../Types/userType";

require('dotenv').config();
import { Pool, Client } from 'pg';
import fs from "fs";
import { DbTableInfo } from "../Types/db.types";

export let pool: Pool;

// single pool instance that will be shared across all services
if(process.env.DB_LOCATION === "local"){
    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT)
    });
    
} else if (process.env.DB_LOCATION === "remote"){
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
}




/*
    This is a function for initializing database. It will
    ease setup of db for people who still don't have it
    running. Moreover, it will ensure that all collaborators 
    have the same database schema. 
*/
export const initializeDB = async () => {
    try{


        let database: Client;


        if(process.env.DB_LOCATION === "local"){
            database = new Client({
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: Number(process.env.DB_PORT)
            })
        } else{
            database = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    rejectUnauthorized: false
                }
            })
        }

        


        await database.connect();


        // drops all databases that exist !!!For development only, in production this will be turned off
        // enables easy reconfiguration of database schema while developing
        if(process.env.DROP_DB_ON_RESTART === "on"){
            if(process.env.DB_LOCATION === "remote"){
                console.log("DB dropping needs to be tuned off while working with remote database");
            } else {
                await database.query("DROP TABLE IF EXISTS exam_question");
                await database.query("DROP TABLE IF EXISTS exam");
                await database.query("DROP TABLE IF EXISTS questions");
                await database.query("DROP TABLE IF EXISTS open_question");
                await database.query("DROP TABLE IF EXISTS choice_question");
                await database.query("DROP TABLE IF EXISTS subject");
                await database.query("DROP TABLE IF EXISTS users");
            console.log("OLD DB dropped");
            }
            
        }


        // creates user table in the database
        if(process.env.AUTOGENERATE_USER_ID === "on"){
            await database.query(`
            CREATE TABLE IF NOT EXISTS users(
                uid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                username TEXT NOT NULL,
                auth_token TEXT,
                field_of_study TEXT,
                contributions INT,
                avatar TEXT,
                discordid TEXT
            );`);
        } else {
            await database.query(`
            CREATE TABLE IF NOT EXISTS users(
                uid uuid PRIMARY KEY,
                username TEXT NOT NULL,
                auth_token TEXT,
                field_of_study TEXT,
                contributions INT,
                avatar TEXT,
                discordid TEXT
            );`);
        }


        // creates subject table in database
        await database.query(`
            CREATE TABLE IF NOT EXISTS subject(
                            sid SERIAL PRIMARY KEY,
                            name VARCHAR(100)
            );
        `)

        // creates choice_question table in database
        await database.query(`
            CREATE TABLE IF NOT EXISTS choice_question(
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
            CREATE TABLE IF NOT EXISTS open_question(
            oqid SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            rating INT,
            sid SERIAL
            );
        `);

        //creates questions table in database
        await database.query(`
            CREATE TABLE IF NOT EXISTS questions(
            qid SERIAL PRIMARY KEY ,
            uid uuid NOT NULL,
            sid SERIAL NOT NULL,
            oqid INTEGER,
            cqid INTEGER,
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
            CREATE TABLE IF NOT EXISTS exam(
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
            CREATE TABLE IF NOT EXISTS exam_question(
            eid SERIAL NOT NULL,
            qid SERIAL NOT NULL,
            answer TEXT,
            PRIMARY KEY (eid, qid),
            CONSTRAINT fk_exam
                FOREIGN KEY (eid)
                    REFERENCES exam(eid),
            CONSTRAINT fk_question
                FOREIGN KEY (qid)
                    REFERENCES questions(qid)
            );
        `);

        console.log("DB initialized successfully");

        const getUsers = await database.query("SELECT * FROM users");
        const userNumber = getUsers.rows.length;

        if(!userNumber){
            const sqlScript = fs.readFileSync("./populate.sql", "utf-8");

            await database.query(sqlScript);

            console.log("DB populated with popualte.sql script");
        }else{
            console.log("DB is populated, populate.sql didn't run");
        }



        //closes database
        await database.end();


    }catch(error){
        console.log("Failed to create db, please check that you have .env file in project and that you have local postgres db running");
        console.log(error)
        process.exit(1);  //terminates node process (shuts down server if db is not created successfully)
    }
}





