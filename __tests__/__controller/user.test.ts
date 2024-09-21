import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { initializeWebServer, stopWebServer } from "../../app";
import { pool } from "../../services/db.services";

let axiosAPIClient: AxiosInstance;
let axiosAPIClientUnauth: AxiosInstance;

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
    axiosAPIClientUnauth = axios.create({
        ...axiosConfig,
        headers: {
            "Cookie": ""
        }
    })

});

afterAll(async () => {
    await stopWebServer();
    await pool.end();
});

describe("GET /users/userdata", () => {
    test("", () => {
        expect(1).toBe(1);
    })
    test("Controller for getting user data should return user data for given authenticated user",async () => {
        const userData = await axiosAPIClient.get("/users/userdata");
        expect(userData.data).toMatchObject({
            username: "user1",
            avatar: "avatar123"
        });
    })

    test("Controler for getting user data should not give any data if user is unauthenticated", async () => {
        const userData = await axiosAPIClientUnauth.get("/users/userdata");
        expect(userData.status).toBe(401);
    })
})
