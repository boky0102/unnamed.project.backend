
require('dotenv').config();
import { Pool, Client, DatabaseError } from 'pg';
import fs from "fs";
import { log } from '../utility/logger.utility';

export let pool: Pool;

// single pool instance that will be shared across all services
if(process.env.DB_LOCATION === "local"){
    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        max: 50,
        allowExitOnIdle: true,
    });

    if(process.env.DEBUG_DB_POOL === "on"){
        pool.on("connect", (client) => {
            console.log("POOL CONNECTED", `Current connections : ${pool.totalCount}  Waiting: ${pool.waitingCount}`);
        })
    
        pool.on("acquire", (client) => {
            console.log("CLIENT AQUIRED FROM POOL", `Current connections : ${pool.totalCount}  Waiting: ${pool.waitingCount}`);
        })
    
        pool.on("release", (err, client) => {
            if(err){
                console.log(err);
            }else {
                console.log("CLIENT RELEASED FROM POOL",  `Current connections : ${pool.totalCount}  Waiting: ${pool.waitingCount}`);
            }
        })
    
        pool.on("remove", (client) => {
            console.log("CLIENT REMOVED FROM POOL", `Current connections : ${pool.totalCount}  Waiting: ${pool.waitingCount}`);
        });
    
        pool.on("error", (err, client) => {
            console.log(err, err.stack);
        })
    }
    
    
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
                log.error("DB dropping needs to be tuned off while working with remote database");
            } else {
                await database.query("DROP TABLE IF EXISTS exam_question");
                await database.query("DROP TABLE IF EXISTS solution_answer");
                await database.query("DROP TABLE IF EXISTS solution");
                await database.query("DROP TABLE IF EXISTS exam");
                await database.query("DROP TABLE IF EXISTS questions");
                await database.query("DROP TABLE IF EXISTS open_question");
                await database.query("DROP TABLE IF EXISTS choice_question");
                await database.query("DROP TABLE IF EXISTS subject");
                await database.query("DROP TABLE IF EXISTS users");
            log.info("OLD DB dropped");
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
            rating INT
            );
        `);

        //creates open_question table in database
        await database.query(`
            CREATE TABLE IF NOT EXISTS open_question(
            oqid SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            rating INT
            );
        `);

        //creates questions table in database
        await database.query(`
            CREATE TABLE IF NOT EXISTS questions(
            qid SERIAL PRIMARY KEY ,
            uid uuid NOT NULL,
            sid INTEGER NOT NULL,
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
            open_questions INT,
            choice_questions INT,
            sid SERIAL NOT NULL,
            CONSTRAINT fk_uid
                FOREIGN KEY (uid)
                    REFERENCES users(uid),
            CONSTRAINT sid
                FOREIGN KEY (sid)
                    REFERENCES subject(sid));
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


        // creates solution table in database
        await database.query(`
            CREATE TABLE IF NOT EXISTS solution(
            solution_id SERIAL PRIMARY KEY,
            eid INTEGER NOT NULL,
            allow_random_review BOOLEAN,
            score INT,
            share_url TEXT,
            pass_code TEXT,
            solved_by uuid NOT NULL,
            checked_by uuid,
            finished BOOLEAN,
            started_at TIMESTAMP DEFAULT NOW()::timestamp,
            CONSTRAINT fk_uid
                FOREIGN KEY(solved_by)
                    REFERENCES users(uid),
            CONSTRAINT fk_uidd
                FOREIGN KEY(checked_by)
                    REFERENCES users(uid),
            CONSTRAINT fk_eid
                FOREIGN KEY(eid)
                    REFERENCES exam(eid));
        `);


        await database.query(`
            CREATE TABLE IF NOT EXISTS solution_answer(
            solution_id INTEGER NOT NULL,
            qid INTEGER NOT NULL,
            user_answer TEXT,
            correct BOOLEAN DEFAULT '0',
            PRIMARY KEY (solution_id, qid),
            CONSTRAINT fk_solution_id
                FOREIGN KEY (solution_id)
                    REFERENCES solution (solution_id),
            CONSTRAINT fk_qid
                FOREIGN KEY (qid)
                    REFERENCES questions (qid)
            );
            `)

        log.info("DB initialized successfully");

        const getUsers = await database.query("SELECT * FROM users");
        const userNumber = getUsers.rows.length;

        if(!userNumber){
            const sqlScript = fs.readFileSync("./populate.sql", "utf-8");

            await database.query(sqlScript);

            log.info("DB populated with popualte.sql script");
        }else{
            log.info("DB is populated, populate.sql didn't run");
        }



        //closes database
        await database.end();


    }catch(error){
        console.log("Failed to create db, please check that you have .env file in project and that you have local postgres db running");
        console.log(error)
        process.exit(1);  //terminates node process (shuts down server if db is not created successfully)
    }
}





