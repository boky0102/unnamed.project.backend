import { ExamChoiceQuestion, ExamOpenQuestion } from "../../Types/exam.types";
import { OpenQuestion } from "../../Types/question.types";
import { parseQID } from "../../utility/database.utility";

describe("Testing database utility function for extracting qid's from array of open or choice questions", () => {
    test("It should create strings that contain all qid's from array of open and choice questions", async () => {

        const mockChoiceQuestionArray: ExamChoiceQuestion[] = [
            {
                qid: 1,
                question: "What is 1+1",
                answer1: "1",
                answer2: "3",
                answer3: "4",
                answer4: "5"
            },
            {
                qid: 5,
                question: "What is the biggest country in the world?",
                answer1: "Russia",
                answer2: "USA",
                answer3: "Brazil",
                answer4: "Netherlands"
            }
        ];

        const mockOpenQuestionArray: ExamOpenQuestion[] = [
            {
                qid: 7,
                question: "What is the biggest building in the World?"
            },
            {
                qid: 10,
                question: "What is the biggest city in the world?"
            },
            {
                qid: 14,
                question: "What is the smallest city in the world?"
            }
        ]
        const qidString = await parseQID(mockOpenQuestionArray, mockChoiceQuestionArray);
        expect(qidString).toMatchObject([1,5,7,10,14]);
    })
})