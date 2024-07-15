import { pool } from "../../services/db.services";
import { generateExam, getRandomChoiceQuestions, getRandomOpenQuestions } from "../../services/exam.services"


afterAll(async () => {
    await pool.end();
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
        console.log(result);
        expect(result).toMatchObject(
            [
                {
                    question: 'What is 2 + 2?',
                    qid: 1,
                    answer1: "3",
                    answer2: "4",
                    answer3: "5",
                    answer4: "6"
                }
            ]
        )
    })

    test("Method for generating exam should generate proper number of open and choice questions", async () => {
        const result = await generateExam(1, "e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8", 4, 4);
        const numberOfChoice = result.choice_questions.reduce((sum, curr) => {
            return sum++;
        }, 0)

        const numberOfOpen = result.open_questions.reduce((sum, curr) => sum++, 0);

        expect(numberOfChoice).toBe(4);
        expect(numberOfOpen).toBe(4);
    } )
})