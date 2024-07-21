import { initializeDB, pool } from "../../services/db.services";
import { generateExam, getExam, getExamsBySubjectId, getRandomChoiceQuestions, getRandomOpenQuestions } from "../../services/exam.services"
import { HttpException } from "../../Types/error";
import { ExamPagableData, ExamPrettyData } from "../../Types/exam.types";


afterAll(async () => {
    await initializeDB();
    await pool.end();
})

describe("Testing exam service", () => {
    test("Method for getting random open questions should return questions", async () => {
        const result = await getRandomOpenQuestions(4, 2);

        expect(result[0]).toHaveProperty("qid");
        expect(result[0]).toHaveProperty("question")
    })

    test("Method for getting random open questions should throw an error if subject id doesn't exist", async() => {

        await expect(async () => {
            return await getRandomOpenQuestions(4, 999);
        }).rejects.toThrow();
        
    })

    test("Method for getting random choice question should return questions", async () => {
        const result = await getRandomChoiceQuestions(1,1);

        expect(result[0]).toHaveProperty("question");
        expect(result[0]).toHaveProperty("qid");
        expect(result[0]).toHaveProperty("answer1");
        expect(result[0]).toHaveProperty("answer2");
        expect(result[0]).toHaveProperty("answer3");
        expect(result[0]).toHaveProperty("answer4");
    })

    test("Method for generating exam should generate proper number of open and choice questions", async () => {
        const result = await generateExam(1, 4, 4, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");

        expect(result.choice_questions.length).toBe(4);
        expect(result.open_questions.length).toBe(4);
    });

    test("Method for generating exam should return data with all relevant properties", async () => {
        const result = await generateExam(1, 1, 1, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        
        expect(result.choice_questions[0]).toHaveProperty("question");
        expect(result.choice_questions[0]).toHaveProperty("qid");
        expect(result.choice_questions[0]).toHaveProperty("answer1");
        expect(result.choice_questions[0]).toHaveProperty("answer2");
        expect(result.choice_questions[0]).toHaveProperty("answer3");
        expect(result.choice_questions[0]).toHaveProperty("answer4");
        
        expect(result.open_questions[0]).toHaveProperty("qid");
        expect(result.open_questions[0]).toHaveProperty("question");
        
    });

    test("Method for generating exam should generate exam even if number of one type of questions is 0", async () => {
        const result = await generateExam(1, 0, 20, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        expect(result.open_questions.length).toBe(0);

        const result2 = await generateExam(1, 10, 0, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        expect(result2.choice_questions.length).toBe(0);
    })


    test("Method for generating exam should not generate exam and it should throw an error when given bad subject id", async () => {
        await expect(async () => {
            return await generateExam(999, 1, 1, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        }).rejects.toThrow(new HttpException(404, "Subject id doesn't exist or there are no questions for given subject"))
    })

    test("Method for generating exam should not generate exam and it should throw an error when given too big number of questions", async () => {
        await expect(async () => {
            return await generateExam(1, 70, 1, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        }).rejects.toThrow(new HttpException(400, "Number of questions is too big, maximum is 50 per question type"));

        await expect(async () => {
            return await generateExam(1, 19, 100, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        }).rejects.toThrow(new HttpException(400, "Number of questions is too big, maximum is 50 per question type"));
    })

    test("Method for getting exam by id should return proper exam when given good exam id", async () => {
        const examData = await getExam(1);
        expect(examData).toMatchObject<ExamPrettyData>(
            {
                eid: 1,
                subjectName: "Chemistry",
                uid: "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0",
                open_questions: 0,
                choice_questions: 2,
                openQuestionData: [],
                choiceQuestionData: [
                    {
                        qid: 1,
                        question: "What is 2 + 2?",
                        answer1: "3",
                        answer2: "4",
                        answer3: "5",
                        answer4: "6"
                    },
                    {
                        qid: 3,
                        question: "What year did World War II end?",
                        answer1: "1945",
                        answer2: "1939",
                        answer3: "1941",
                        answer4: "1950"
                    }
                ]
            }
        )
    })

    test("Method for getting exam should throw when given non existing exam id", async () => {
        await expect(async () => {
            return await getExam(999);
        }).rejects.toThrow(new HttpException(404, "Exam with given id wasn't found"));
    })

    test("Method for getting exams by subject id should return proper exam data", async () => {
        const examsData = await getExamsBySubjectId(2, 1, 10);
        expect(examsData).toMatchObject<ExamPagableData>({
            sid: 2,
            page: 1,
            pageLimit: 10,
            exams: [
                {
                    eid: 1,
                    subjectName: "Chemistry",
                    uid: "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0",
                    open_questions: 0,
                    choice_questions: 2,
                    openQuestionData: [],
                    choiceQuestionData: [
                        {
                            qid: 1,
                            question: "What is 2 + 2?",
                            answer1: "3",
                            answer2: "4",
                            answer3: "5",
                            answer4: "6"
                        },
                        {
                            qid: 3,
                            question: "What year did World War II end?",
                            answer1: "1945",
                            answer2: "1939",
                            answer3: "1941",
                            answer4: "1950"
                        }
                    ]
                }
            ]
        })
    })

    test("Method for getting exams by subject id should throw error if given non existing subject id", async () => {
        await expect(async () => {
            await getExamsBySubjectId(999, 1, 10);
        }).rejects.toThrow(new HttpException(404, "Exam with given subject id is not found or there are no results for the given page"));
    })

    test("Method for getting exams by subject id should throw error if given page which does not exist", async () => {
        await expect(async () => {
            await getExamsBySubjectId(1, 50, 10);
        }).rejects.toThrow(new HttpException(404, "Exam with given subject id is not found or there are no results for the given page"));
    })

    test("Method for getting exams should throw error if given negative values for page", async () => {
        await expect(async () => {
            await getExamsBySubjectId(1, -10, 5);
        }).rejects.toThrow(new HttpException(400, "Bad request, page number and items per page must be positive numbers"));
    })

    test("Method for getting exams should throw error if given negative values for page limit", async () => {
        await expect(async () => {
            await getExamsBySubjectId(1, 1, -5);
        }).rejects.toThrow(new HttpException(400, "Bad request, page number and items per page must be positive numbers"));
    })
})