import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import supertest from "supertest";
import { initializeWebServer, stopWebServer } from "../../app";
import { pool } from "../../services/db.services";

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
    
    const apiConnection = await initializeWebServer();
    const axiosConfig: AxiosRequestConfig = {
        baseURL: `http://localhost:3001`,
        validateStatus: () => true
    };

    axiosAPIClient = axios.create(axiosConfig);

});

afterAll(async () => {
    await stopWebServer();
    await pool.end();
});

describe("Test protection against unauthenticated users", () => {
    it("Should respond with unauthenticated code to request without valid cookie", async () => {
        const response = await axiosAPIClient.get("/auth/protected");
        expect(response.status).toBe(401);
    })

})