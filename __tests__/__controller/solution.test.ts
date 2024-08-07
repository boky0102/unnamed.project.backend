import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { initializeWebServer, stopWebServer } from "../../app";
import { pool } from "../../services/db.services";
import { SolutionExamData } from "../../Types/solution.types";
import { getExam } from "../../services/exam.services";

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

describe("ROUTE /solution", () => {
    describe(" GET /solution/:id", () => {
        test("route for getting a solution should return all solution data when provided with good solution id", async () => {
            const response = await axiosAPIClient.get("/solution/1");
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty("solutionId");
            expect(response.data.solutionId).toBe(1);
            expect(response.data).toHaveProperty("solvedBy");
            expect(response.data.solvedBy).toBe("c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0")
            expect(response.data).toHaveProperty("eid");
            expect(response.data.eid).toBe(1)
            expect(response.data).toHaveProperty("allowRandomReview");
            expect(response.data.allowRandomReview).toBe(true);
            expect(response.data).toHaveProperty("passCode");
            expect(response.data.passCode).toBe("random-pass-code");
            expect(response.data).toHaveProperty("finished");
            expect(response.data.finished).toBe(false);
            expect(response.data).toHaveProperty("startedAt");
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
})