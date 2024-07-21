import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { initializeWebServer, stopWebServer } from "../../app";
import { pool } from "../../services/db.services";
import { ExamData, ExamPrettyData } from "../../Types/exam.types";

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

describe("ROUTE /exam", () => {
    describe("  GET /?open=N&choice=N&sid=SID", () => {
        test("It should generate exam when given paramenters that are in valid range (1 - 50)", async () => {
            const response = await axiosAPIClient.get<ExamData>("/exam?open=5&choice=5&sid=1");
            expect(response.data.choice_questions.length).toBe(5);
            expect(response.data.open_questions.length).toBe(5);
            expect(1).toBe(1);
        })

        test("Response should contain valid data with all necessary attributes", async () => {
            const response = await axiosAPIClient.get<ExamData>("/exam?open=5&choice=5&sid=1");
            expect(response.data.choice_questions.length).toBe(5);
            expect(response.data.open_questions.length).toBe(5);
            
            const choiceResponseKeys = Object.keys(response.data.choice_questions[0])
            const choiceKeys = ["qid", "answer1", "answer2", "answer3", "answer4", "question"];
            let choiceKeysGood = true;
            choiceResponseKeys.forEach((key) => {
                if(!choiceKeys.includes(key)) choiceKeysGood = false
            })
            expect(choiceKeysGood).toBe(true);
            
            const openResponseKeys  = Object.keys(response.data.open_questions[0]);
            const openKeys = ["qid", "question"];
            let openKeysGood = true;
            openResponseKeys.forEach((key) => {
                if(!openKeys.includes(key)) openKeysGood = false;
            });
            expect(openKeysGood).toBe(true);
            
        })

        test("It should not generate exam when given bad subject id and give proper response status code", async () => {
            const response = await axiosAPIClient.get<ExamData>("/exam?open=5&choice=5&sid=3333");
            expect(response.status).toBe(404);
        })

        test("It should not generate exam when missing query parameters in the url", async () => {
            const response = await axiosAPIClient.get<ExamData>("/exam?open=5&choice=5");
            expect(response.status).toBe(400);

            const response2 = await axiosAPIClient.get<ExamData>("/exam?open=5&sid=1");
            expect(response2.status).toBe(400);

            const response3 = await axiosAPIClient.get<ExamData>("/exam?choice=1&sid=1");
            expect(response3.status).toBe(400);
        })

        test("It should not generate an exam when asked for number of questions bigger then maximum", async () => {
            const response = await axiosAPIClient.get<ExamData>("/exam?open=1&choice=57&sid=1");
            expect(response.status).toBe(400);

            const response2 = await axiosAPIClient.get<ExamData>("/exam?open=55&choice=14&sid=1");
            expect(response2.status).toBe(400);
        })

    

        test("It should generate exam when number of avaliable questions is smaller than the one requested", async () => {
            const response = await axiosAPIClient.get<ExamData>("/exam?open=1&choice=40&sid=1");
            expect(response.status).toBe(200);
        });



    });
    describe("  GET /{id}", () => {
        test("It should return exam when given proper examID", async () => {
            const response = await axiosAPIClient.get<ExamPrettyData>("/exam/1");
            expect(response.data).toMatchObject<ExamPrettyData>(
                {
                    eid: 1,
                    subjectName: "Chemistry",
                    uid: "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0",
                    open_questions: 0,
                    choice_questions: 2,
                    openQuestionData: [],
                    choiceQuestionData: [
                        {
                            qid: 1,
                            question: "What is 2 + 2?",
                            answer1: "3",
                            answer2: "4",
                            answer3: "5",
                            answer4: "6"
                        },
                        {
                            qid: 3,
                            question: "What year did World War II end?",
                            answer1: "1945",
                            answer2: "1939",
                            answer3: "1941",
                            answer4: "1950"
                        }
                    ]
                }
            )
        })
        test("It should not return data and respond with status code 404 when provided with wrong exam id", async() => {
            const response = await axiosAPIClient.get<ExamPrettyData>("/exam/999");
            expect(response.status).toBe(404);
        })
    })
})