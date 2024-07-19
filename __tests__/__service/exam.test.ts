import { pool } from "../../services/db.services";
import { generateExam, getRandomChoiceQuestions, getRandomOpenQuestions } from "../../services/exam.services"


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
        
        
    })
})