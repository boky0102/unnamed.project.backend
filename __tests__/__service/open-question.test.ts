import { HttpException } from "../../Types/error";
import { initializeDB, pool } from "../../services/db.services";
import { OpenQuestionData } from "../../Types/question.types";

import { getOpenQuestion, saveOpenQuestion, validateOpenQuestionRequestData } from "../../services/question.services";


afterAll(async () => {
    await pool.end();
})

describe("Open question service should work properly", () => {

    test("Should validate open question data properly", async() => {

        const mockData1 = {

            question: "blabla",
            sid: 3

        }

        const mockData2 = {
            sid: 2
        }

        const valid = await validateOpenQuestionRequestData(mockData1);

        const valid2 = await validateOpenQuestionRequestData(mockData2);

        expect(valid).toBe(true);
        expect(valid2).toBe(false);
    });

    test("Should save new open question data given proper data", async() => {

        const mockOpenQuestion: OpenQuestionData = {
            question: "What is the biggest question in this database ?",
            sid: 1
        };

        const result = await saveOpenQuestion(mockOpenQuestion, "e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8");

        expect(result !== null).toBe(true);

    });

    test("Should not save open question data with invalid data", async() => {

        const mockOpenQuestion: OpenQuestionData = {
            question: "",
            sid: 3
        }

        await expect(async () => {
            return await saveOpenQuestion(mockOpenQuestion, "e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8");
        }).rejects.toThrow(new HttpException(400, "Bad open question data provided, missing fields or too short question"));

    });

    test("Should get open question from the db", async () => {
        
        const question = await getOpenQuestion(2);
        expect(question).toMatchObject({
            qid: 2,
            uid: "e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8",
            sid: 3,
            question: "Discuss the causes of the American Civil War."
        });
    })

    test("Should not get open question with wrong question id", async() => {


        await expect(async () => {
            return await getOpenQuestion(999);
        }).rejects.toThrow(new HttpException(404, "Question with given id doesn't exist"))
        
    })
})