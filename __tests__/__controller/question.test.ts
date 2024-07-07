import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { initializeWebServer, stopWebServer } from "../../app";
import { pool } from "../../services/db.services";
import { ChoiceQuestionData, ChoiceQuestionExtended, OpenQuestion, OpenQuestionData } from "../../Types/question.types";

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
    
    const apiConnection = await initializeWebServer();
    const axiosConfig: AxiosRequestConfig = {
        baseURL: `http://localhost:3001`,
        validateStatus: () => true,
        headers: {
            "Cookie": 'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
        }
    };

    axiosAPIClient = axios.create(axiosConfig);

});

afterAll(async () => {
    await stopWebServer();
    await pool.end();
});

describe("ROUTE /question", () => {
    describe(" GET /open-ended", () => {
        test("It should respond with open-ended question data when given valid question id", async () => {
            const response = await axiosAPIClient.get<OpenQuestion>("/question/open-ended/2");
            console.log(response.data);
            expect(response).toMatchObject({
                status: 200,
                data: 
                    {
                        qid: 2,
                        uid: "e136f9a8-4bbf-4a70-91a3-0d39fd0f34b8",
                        sid: 3,
                        question: "Discuss the causes of the American Civil War."
                    }
                
            })
        })

        test("It should respond with not found when asking for open ended question while providing wrong id", async () => {
            const response = await axiosAPIClient.get("/question/open-ended/999");

            expect(response.status).toBe(404);
        })
    })

    describe(" POST /open-ended", () => {
        test("It should respond with created status when provided with valid open ended question data", async () => {
            const mockQuestionData: OpenQuestionData = {
                sid: 1,
                question: "What is the result of 5 + 5 ?"
            }
            const response = await axiosAPIClient.post("/question/open-ended", mockQuestionData);
            expect(response.status).toBe(201);

        })

        test("It should not create new open ended question when given non existing subject id", async () => {
            const mockOpenQuestion: OpenQuestionData = {
                sid: 999,
                question: "What is the result of 5 + 5"
            }

            const respons = await axiosAPIClient.post("/question/open-ended", mockOpenQuestion);
            expect(respons.status).toBe(500);  // subject id dosn't exist
        })

        test("It should not create new open ended question when given invalid question data", async () => {
            const mockOpenQuestion: OpenQuestionData = {
                sid: 1,
                question: "1+1?"
            }

            const response = await axiosAPIClient.post("/question/open-ended", mockOpenQuestion);
            expect(response.status).toBe(400);
        })
    })

    describe(" GET /choice", () => {
        test("It should get choice question when given existing question id", async () => {
            const response = await axiosAPIClient.get<ChoiceQuestionExtended>("/question/choice/1");
            expect(response).toMatchObject({
                status: 200,
                data: {
                    qid: 1,
                    uid: "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0",
                    sid: 1,
                    question: "What is 2 + 2?",
                    answer1: "3",
                    answer2: "4",
                    answer3: "5",
                    answer4: "6",
                    solution: 2
                }
            });
        })

        test("It should respond with not found when given non existant question id", async() => {
            const response = await axiosAPIClient.get<ChoiceQuestionExtended>("/question/choice/333");
            expect(response.status).toBe(404);
        })
    });

    describe(" POST /choice", () => {
        test("It should post choice question when given valid data", async () => {
            const mockChoiceQuestion: ChoiceQuestionData = {
                question: "What is the smallest prime number?",
                answer1: "33",
                answer2: "2",
                answer3: "1",
                answer4: "7",
                solution: 3,
                sid: 1
            };

            const response = await axiosAPIClient.post("/question/choice", mockChoiceQuestion);
            expect(response.status).toBe(201);
        });

        test("It should not create new choice question when not given all data", async () => {
            const mockChoiceQuestion = {
                question: "What is the smallest prime number?",
                answer1: "33",
                answer2: "2",
                answer3: "1",
                answer4: "7",
                sid: 1
            };

            const response = await axiosAPIClient.post("/question/choice", mockChoiceQuestion);
            expect(response.status).toBe(400);

            const mockChoiceQuestion2 = {
                answer1: "33",
                answer2: "2",
                answer3: "1",
                answer4: "7",
                sid: 1
            };

            const response2 = await axiosAPIClient.post("/question/choice", mockChoiceQuestion2);
            expect(response.status).toBe(400);
            
        });

        test("It should not create new choice question when given invalid data", async () => {
            const mockChoiceQuestion: ChoiceQuestionData = {
                question: "Prime?",
                answer1: "33",
                answer2: "2",
                answer3: "1",
                answer4: "7",
                solution: 3,
                sid: 1
            }

            const response = await axiosAPIClient.post("/question/choice", mockChoiceQuestion);
            expect(response.status).toBe(400);
        })
    })
})