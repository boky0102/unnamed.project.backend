import { pool } from "../../services/db.services";
import { saveChoiceQuestion, validateChoiceQuestionPostData } from "../../services/question.services";

describe("Question service should properly save and validate choice questions", () => {
    it("Should invalidate bad choice question data", async () => {
        const invalidMockData: ChoiceQuestionData = {
            question: "short?",
            answer1: "yes",
            answer2: "yes",
            answer3: "yes",
            answer4: "yes",
            solution: 4,
            sid: 1
        };

        const valid = await validateChoiceQuestionPostData(invalidMockData);
        expect(valid).toBe(false);

        const invalidMockData2: ChoiceQuestionData = {
            question: "Is this one too short?",
            answer1: "no",
            answer2: "no",
            answer3: "no",
            answer4: "no",
            solution: 5,
            sid: 1
        };

        const valid2 = await validateChoiceQuestionPostData(invalidMockData2);
        expect(valid2).toBe(false);


    });

    it("Should save choice question properly to the database", async () => {
        const mockData: ChoiceQuestionData = {
            question: "What is the most renown computer science award?",
            answer1: "Turing",
            answer2: "Nobel",
            answer3: "Tesla",
            answer4: "Edison",
            solution: 1,
            sid: 1
        };

        const savedQuestionId = await saveChoiceQuestion(mockData, "e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8");
        expect(savedQuestionId).not.toBe(null);

        const conn = await pool.connect();

        const testQuery = "SELECT qid FROM questions WHERE qid = $1";
        const testValues = [savedQuestionId];
        const dbRes = await conn.query<Question>(testQuery, testValues);

        expect(savedQuestionId).toBe(dbRes.rows[0].qid);

        conn.release();


    })
})