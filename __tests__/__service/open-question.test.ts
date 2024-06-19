import { HttpException } from "../../Types/error";
import { initializeDB, pool } from "../../services/db.services";
import { saveOpenQuestion, validateOpenQuestionRequestData } from "../../services/question.services";

/* beforeAll(async () => {
    await initializeDB();
}) */

afterAll(async () => {
    await pool.end();
})

describe("Open question service should work properly", () => {

    it("Should validate open question data properly", async() => {

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

    it("Should save new open question data given proper data", async() => {

        const mockOpenQuestion: OpenQuestionData = {
            question: "What is the biggest question in this database ?",
            sid: 1
        };

        const result = await saveOpenQuestion(mockOpenQuestion, "e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8");

        expect(result !== null).toBe(true);

    });

    it("Should not save open question data with invalid data", async() => {


        const mockOpenQuestion: OpenQuestionData = {
            question: "",
            sid: 3
        }

        try{

            await saveOpenQuestion(mockOpenQuestion, "e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8");

        }catch(error){
            expect(error).toEqual(new HttpException(400, "Bad request"));
        }

    });
})