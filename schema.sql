
DROP TABLE IF EXISTS  users;
CREATE TABLE Users(
                      uid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                      username TEXT NOT NULL,
                      auth_token TEXT,
                      field_of_study TEXT,
                      contributions INT
);

DROP TABLE IF EXISTS subject;
CREATE TABLE subject(
                        sid SERIAL PRIMARY KEY,
                        name VARCHAR(100)
);


DROP TABLE IF EXISTS choice_question;
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

DROP TABLE IF EXISTS open_question;
CREATE TABLE open_question(
    oqid SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    rating INT,
    sid SERIAL
);

DROP TABLE IF EXISTS  questions;
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


DROP TABLE IF EXISTS exam;
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


DROP TABLE IF EXISTS exam_question;
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