import { pool } from "../../services/db.services";
import { getRandomChoiceQuestions, getRandomOpenQuestions } from "../../services/exam.services"


afterAll(() => {
    pool.end();
})

describe("Testing exam service", () => {
    test("Method for getting random open questions should return questions", async () => {
        const result = await getRandomOpenQuestions(4, 2);
        expect(result).toMatchObject([
            {
                qid: 5,
                question: "Explain the concept of photosynthesis."
            }
        ])
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
        expect(result).toMatchObject([
            {
                qid: 1,
                question: "What is 2 + 2?",
                answer1: "3",
                answer2: "4",
                answer3: "5",
                asnwer4: "6"
            }
        ])

        console.log(result); 
    })
})