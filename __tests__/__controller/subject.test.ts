import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
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

describe("GET /subject", () => {
    
    test("It should return json containing all subject names staring with giver string paramether", async() => {
        const response = await axiosAPIClient
            .get("/subject?query=math", {
                headers: {
                    "Cookie": 'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
                }
            });

        expect(response).toMatchObject({
            status: 200,
            data: [
                {
                    name: "Mathematics",
                    sid: 1
                }
            ]
        })
        
    })

    test("It should respond with not found status code if there are no subjects starting with given query parameter", async() => {
        const response = await axiosAPIClient
            .get("/subject?query=asdsdss", {
                headers: {
                    "Cookie": 'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
                }
            });

        expect(response.status).toBe(404);
    })

})

describe("POST /subject", () => {
    test("It should respond with 400 (bad request) when trying to post with invalid data", async () => {
        const payload = {
            subject: 's'
        };
        const response = await axiosAPIClient.post("/subject", payload, {
            headers: {
                "Cookie": 'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
            }
        })

        expect(response.status).toBe(400);
    })

    test("It should create new subject and respond with status 201 when given valid subject data", async () => {
        const payload = {
            subject: 'Web development'
        };
        
        const response = await axiosAPIClient.post("/subject", payload, {
            headers: {
                "Cookie": 'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
            }
        })

        expect(response.status).toBe(201);

        const getResponse = await axiosAPIClient.get("/subject?query=Web%20development", {
            headers: {
                "Cookie": 'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
            }
        })

        expect(getResponse).toMatchObject({
            status: 200,
            data: [
                {
                    name: "Web development",
                    sid: 4
                }
            ]
        })
    })

    test("It should not create new subject and respond with status code 400 when given existing subject", async () => {
        const payload = {
            subject: 'Mathematics'
        };
        const response = await axiosAPIClient.post("/subject", payload, {
            headers: {
                "Cookie": 'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
            }
        })
        expect(response.status).toBe(400);
    })
})