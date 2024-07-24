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

INSERT INTO choice_question (question, answer1, answer2, answer3, answer4, solution, rating) VALUES
('What is 2+2?', '3', '4', '5', '6', 2, 5),
('What is the square root of 16?', '2', '3', '4', '5', 3, 4),
('Which number is prime?', '4', '6', '9', '7', 4, 3),
('What is 5 * 6?', '28', '30', '32', '34', 2, 5),
('What is 15 / 3?', '4', '5', '6', '7', 2, 4),
('What is the derivative of x^2?', '1', '2x', 'x', 'x^2', 2, 5),
('What is the integral of 2x?', 'x^2', '2x', 'x^3', '4x', 1, 4),
('What is the value of π (pi)?', '3.12', '3.14', '3.16', '3.18', 2, 5),
('What is 7 * 8?', '54', '56', '58', '60', 2, 3),
('What is 9 / 3?', '2', '3', '4', '5', 2, 4),
('What is the sum of the angles in a triangle?', '90 degrees', '180 degrees', '270 degrees', '360 degrees', 2, 4),
('What is the square of 5?', '20', '25', '30', '35', 2, 3),
('Which is an even number?', '5', '7', '9', '10', 4, 2),
('What is the logarithm of 100 base 10?', '1', '2', '3', '4', 2, 5),
('What is the hypotenuse of a right triangle with sides 3 and 4?', '5', '6', '7', '8', 1, 5),
('What is the sum of the first five prime numbers?', '15', '26', '28', '30', 3, 4),
('What is the formula for the area of a rectangle?', 'length + width', '2 * (length + width)', 'length * width', 'length / width', 3, 4),
('What is 12 squared?', '122', '124', '144', '164', 3, 5),
('Which of the following is a Pythagorean triple?', '(3, 4, 6)', '(5, 12, 13)', '(8, 15, 18)', '(7, 24, 25)', 2, 5),
('What is the result of 2^3?', '4', '6', '8', '10', 3, 5);


-- Open Questions
INSERT INTO open_question (question, rating)
VALUES
    ('What is the capital of France?', 3),
    ('Explain the concept of photosynthesis.', 5),
    ('Discuss the causes of the American Civil War.', 4);

INSERT INTO open_question (question, rating) VALUES
('Explain the Pythagorean theorem.', 5),
('Describe the process of finding the derivative of a function.', 4),
('What is the significance of the number zero in mathematics?', 5),
('How do you solve a quadratic equation?', 5),
('What is the importance of prime numbers in number theory?', 4),
('Explain the concept of a limit in calculus.', 5),
('Describe how to calculate the area of a circle.', 3),
('What is the difference between permutations and combinations?', 4),
('Explain how to find the volume of a cylinder.', 3),
('What are the fundamental properties of logarithms?', 4),
('What is the binomial theorem?', 5),
('Describe the Fibonacci sequence.', 4),
('What is a vector in mathematics?', 3),
('Explain the concept of mathematical induction.', 5),
('How do you determine the convergence of a series?', 4),
('What is an eigenvalue in linear algebra?', 5),
('Describe the difference between differential and integral calculus.', 5),
('Explain the concept of a mathematical proof.', 4),
('What is the significance of Euler’s formula in complex analysis?', 5),
('Describe the properties of a normal distribution.', 4),
('What is a matrix and how is it used in mathematics?', 3),
('Explain the fundamental theorem of algebra.', 5),
('How do you solve a system of linear equations?', 4),
('What is the role of symmetry in geometry?', 3),
('Describe the properties of a rhombus.', 4),
('What is the significance of the golden ratio?', 5),
('Explain how to perform polynomial division.', 4),
('What are the different types of triangles?', 3),
('Describe the properties of a parallelogram.', 4),
('What is the purpose of using imaginary numbers?', 5);


-- Questions
INSERT INTO questions (uid, sid, oqid, cqid)
VALUES
    ('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 1), -- 2+2
    ('e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8', 3, 3, NULL), -- Civil war
    ('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 3, NULL, 3), -- ww2 end
    ('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 2, NULL, 2), -- penicillin
    ('e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8', 2, 2, NULL), -- Photosynthesis
    ('e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8', 3, 1, NULL); -- Capital France

INSERT INTO questions (uid, sid, oqid, cqid) VALUES
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 4),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 5),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 6),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 7),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 8),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 9),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 10),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 11),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 12),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 13),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 14),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 15),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 16),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 17),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 18),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 19),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 20),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 21),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 22),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, NULL, 23),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 4, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 5, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 6, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 7, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 8, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 9, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 10, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 11, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 12, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 13, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 14, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 15, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 16, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 17, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 18, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 19, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 20, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 21, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 22, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 23, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 24, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 25, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 26, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 27, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 28, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 29, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 30, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 31, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 32, NULL),
('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 33, NULL);



-- Exam
INSERT INTO exam (uid, open_questions, choice_questions, sid)
VALUES
    ('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 0, 2, 2),
    ('e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8', 3, 2, 3),
    ('c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0', 1, 5, 1);

-- Exam Questions
INSERT INTO exam_question (eid, qid, answer)
VALUES
    (1, 1, '4'),
    (1, 3, '1945'),
    (2, 6, 'Paris'),
    (2, 4, 'Marie Curie'),
    (3, 3, '1945'),
    (3, 2, 'Discuss the causes of the American Civil War');

INSERT INTO solution (eid, allow_random_review, pass_code, solved_by)
VALUES 
    (1, '1', 'random-pass-code', 'c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'),
    (1, '0', 'random-pass-code', 'c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0');
