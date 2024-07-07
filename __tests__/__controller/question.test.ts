import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { initializeWebServer, stopWebServer } from "../../app";
import { pool } from "../../services/db.services";
import { OpenQuestion, OpenQuestionData } from "../../Types/question.types";

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
    })
})