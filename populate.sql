-- Users
INSERT INTO users (uid ,username, auth_token, field_of_study, contributions, discordID, avatar)
VALUES
    ('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0' ,'user1', 'auth_token1', 'Computer Science', 10, 'discord123', 'avatar123'),
    ('e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8','user2', 'auth_token2', 'Physics', 5, 'discord456', 'avatar456'),
    ('8ffa8839-a6ce-4eb2-8484-5341645f1a36', 'borna_ivankovic', 'WDsF9Ryw5fsdfsdfsdfdsemSSG1gRzeNbJM', null, null, '4324329042390','https://cdn.discordapp.com/avatars/398501114095337472/12eebc5c0a8e0ecbfc48ead85d2e50bd.png
398501114095337472');

-- Subject
INSERT INTO subject (name)
VALUES
    ('Mathematics'),
    ('Chemistry'),
    ('History');

-- Choice Questions
INSERT INTO choice_question (question, answer1, answer2, answer3, answer4, solution, rating)
VALUES
    ('What is 2 + 2?', '3', '4', '5', '6', 2, 4),
    ('Who discovered penicillin?', 'Isaac Newton', 'Marie Curie', 'Alexander Fleming', 'Albert Einstein', 3, 5),
    ('What year did World War II end?', '1945', '1939', '1941', '1950', 1, 4);

-- Open Questions
INSERT INTO open_question (question, rating)
VALUES
    ('What is the capital of France?', 3),
    ('Explain the concept of photosynthesis.', 5),
    ('Discuss the causes of the American Civil War.', 4);

-- Questions
INSERT INTO questions (uid, sid, oqid, cqid)
VALUES
    ('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 1), -- 2+2
    ('e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8', 3, 3, NULL), -- Civil war
    ('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 3, NULL, 3), -- ww2 end
    ('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 2, NULL, 2), -- penicillin
    ('e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8', 2, 2, NULL), -- Photosynthesis
    ('e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8', 3, 1, NULL); -- Capital France


-- Exam
INSERT INTO exam (uid, score, open_questions, choice_questions, subject_id)
VALUES
    ('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 85, 2, 4, 2),
    ('e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8', 70, 3, 2, 3),
    ('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 92, 1, 5, 1);

-- Exam Questions
INSERT INTO exam_question (eid, qid, answer)
VALUES
    (1, 1, '4'),
    (1, 3, '1945'),
    (2, 6, 'Paris'),
    (2, 4, 'Marie Curie'),
    (3, 3, '1945'),
    (3, 2, 'Discuss the causes of the American Civil War');
