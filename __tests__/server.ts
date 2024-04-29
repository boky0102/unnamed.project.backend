import supertest from "supertest";
import app from "../app";

const request = supertest;

describe("Testing the root path - /", () => {
    test("It should respond with status 200 on GET method", async() => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    })
    
})