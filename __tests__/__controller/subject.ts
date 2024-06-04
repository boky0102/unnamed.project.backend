import supertest from "supertest"
import app from "../../app";
import { isExportDeclaration } from "typescript";

const request = supertest;
const agent = request.agent(app);

describe("Subject GET routes should behave properly and respond with correct http codes", () => {
    
    test("It should return json containing all subject names staring with giver string paramether", async() => {
        const response = await agent
            .get("/subject?query=mech")
            .set('Cookie', [
                'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
            ])
            .send()

        expect(response.status).toBe(200);
        
        expect(response.body.length > 0).toBe(true);
        expect(response.body[0]).toHaveProperty("name");
        expect(response.body[0]).toHaveProperty("sid");
        
    })

    test("It should respond with not found status code if there are no subjects starting with given query parameter", async() => {
        const response = await agent
            .get("/subject?query=dsafds")
            .set("Cookie", [
                'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
            ])
            .send()

            expect(response.status).toBe(404);
    })

})

describe("Subject POST route should behave properly", () => {
    test("It should respond with 400 (bad request) when trying to post with invalid data", async () => {
        const payload = {
            subject: 's'
        };
        const response = await agent
            .post("/subject")
            .set("Cookie", [
                'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
            ])
            .send(payload);

        expect(response.status).toBe(400);
    })

    test("It should create new subject and respond with status 201 when given valid subject data", async () => {
        const payload = {
            subject: 'Web development'
        };
        
        const response = await agent
            .post("/subject")
            .set("Cookie", [
                'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
            ])
            .send(payload)
        expect(response.status).toBe(201);

        const getResponse = await agent
            .get("/subject?query=Web%20development")
            .set("Cookie", [
                'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
            ])
            .send(payload);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.length).toBe(1);
    })

    test("It should not create new subject and respond with status code 400 when given existing subject", async () => {
        const payload = {
            subject: 'Web development'
        };
        const response = await agent
            .post("/subject")
            .set("Cookie", [
                'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
            ])
            .send(payload);
        expect(response.status).toBe(400);
    })
})