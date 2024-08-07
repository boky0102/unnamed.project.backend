import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { initializeWebServer, stopWebServer } from "../../app";
import { pool } from "../../services/db.services";
import { SolutionDBCamelCase, SolutionExamData } from "../../Types/solution.types";
import { getExam } from "../../services/exam.services";

let axiosAPIClient: AxiosInstance;
let axiosUnauthAPIClient: AxiosInstance;
let axiosAPIClientUser2: AxiosInstance;

beforeAll(async () => {
    
    const apiConnection = await initializeWebServer();
    const axiosConfig: AxiosRequestConfig = {
        baseURL: `http://localhost:3001`,
        validateStatus: () => true,
        headers: {
            "Cookie": 'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
        }
    };

    const axiosUnauthenticatedClient = {
        ...axiosConfig,
        headers: {
            "Cookie" : ""
        }
    }

    // user with no solutions
    const axiosUser2Config = {
        ...axiosConfig,
        headers: {
            "Cookie" : 'token=8ffa8839-a6ce-4eb2-8484-5341645f1a36'
        }
    }

    axiosAPIClient = axios.create(axiosConfig);

    axiosUnauthAPIClient = axios.create(axiosUnauthenticatedClient);

    axiosAPIClientUser2 = axios.create(axiosUser2Config);

});

afterAll(async () => {
    await stopWebServer();
    await pool.end();
});

describe("ROUTE /solution", () => {
    describe(" GET /solution/:id", () => {
        test("route for getting a solution should return all solution data when provided with good solution id", async () => {
            const response = await axiosAPIClient.get("/solution/1");
            expect(response.status).toBe(200);
            expect(response.data.solutionId).toBe(1);
            expect(response.data.solvedBy).toBe("c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0")
            expect(response.data.eid).toBe(1)
            expect(response.data.allowRandomReview).toBe(true);
            expect(response.data.passCode).toBe("random-pass-code");
            expect(response.data.finished).toBe(false);
            expect(response.data).toHaveProperty("examData");
            const examData = await getExam(1);
            expect(response.data.examData).toMatchObject(examData);
        })
    });
    test("route for getting solution should return 404 if given solution id that does not exist", async () => {
        const response = await axiosAPIClient.get("/solution/999");
        expect(response.status).toBe(404);
    })
    test("route for getting solution should return 404 if given invalid solution id", async () => {
        const response = await axiosAPIClient.get("/solution/dsdasda");
        expect(response.status).toBe(400);
    })

    describe(" GET /solution", () => {
        test("route for getting all solutions for given user should return all solutions by authenticated user", async () => {
            const response = await axiosAPIClient.get("/solution");
            expect(response.status).toBe(200);
            expect(response.data).toMatchObject([
                {
                    solutionId: 1,
                    eid: 1,
                    allowRandomReview: true,
                    passCode: "random-pass-code",
                    solvedBy: "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0",
                    finished: false,
                    startedAt: "2024-05-05T10:00:00.000Z"
                },
                {
                    solutionId: 2,
                    eid: 1,
                    allowRandomReview: false,
                    passCode: "random-pass-code",
                    solvedBy: "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0",
                    finished: false,
                    startedAt: "2024-05-05T10:00:00.000Z"
                }
            ])
        });

        test("route for getting all solutions by unauthenticated user should response with 401", async () => {
            const response = await axiosUnauthAPIClient.get("/solution");
            expect(response.status).toBe(401);
        })

        test("route for getting all solutions should respond with 404 when requested by authenticated user with no solutions", async () => {
            const response = await axiosAPIClientUser2.get("/solution");
            expect(response.status).toBe(404);
        })
    })
})