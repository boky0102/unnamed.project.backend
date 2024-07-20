import { pool } from "../../services/db.services";
import { generateExam, getRandomChoiceQuestions, getRandomOpenQuestions } from "../../services/exam.services"
import { HttpException } from "../../Types/error";


afterAll(async () => {
    await pool.end();
})

describe("Testing exam service", () => {
    test("Method for getting random open questions should return questions", async () => {
        const result = await getRandomOpenQuestions(4, 2);

        expect(result[0]).toHaveProperty("qid");
        expect(result[0]).toHaveProperty("question")
    })

    test("Method for getting random open questions should throw an error if subject id doesn't exist", async() => {
        try{
            const result = await getRandomOpenQuestions(4, 999);
            
        }catch(error){
            expect(error).toBeTruthy();
        }
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
        const result = await generateExam(1, 4, 4);

        expect(result.choice_questions.length).toBe(4);
        expect(result.open_questions.length).toBe(4);
    });

    test("Method for generating exam should return data with all relevant properties", async () => {
        const result = await generateExam(1, 1, 1);
        
        expect(result.choice_questions[0]).toHaveProperty("question");
        expect(result.choice_questions[0]).toHaveProperty("qid");
        expect(result.choice_questions[0]).toHaveProperty("answer1");
        expect(result.choice_questions[0]).toHaveProperty("answer2");
        expect(result.choice_questions[0]).toHaveProperty("answer3");
        expect(result.choice_questions[0]).toHaveProperty("answer4");
        
        expect(result.open_questions[0]).toHaveProperty("qid");
        expect(result.open_questions[0]).toHaveProperty("question");
        
    });


    test("Method for generating exam should not generate exam and it should throw an error when given bad subject id", async () => {
        await expect(async () => {
            return await generateExam(999, 1, 1);
        }).rejects.toThrow(new HttpException(404, "Subject id doesn't exist or there are no questions for given subject"))
    })

    test("Method for generating exam should not generate exam and it should throw an error when given too big number of questions", async () => {
        await expect(async () => {
            return await generateExam(1, 70, 1);
        }).rejects.toThrow(new HttpException(400, "Number of questions is too big, maximum is 50 per question type"));

        await expect(async () => {
            return await generateExam(1, 19, 100);
        }).rejects.toThrow(new HttpException(400, "Number of questions is too big, maximum is 50 per question type"));
    })
})