import supertest from "supertest"
import app from "../../app";
import { isExportDeclaration } from "typescript";

const request = supertest;
const agent = request.agent(app);

describe("Subject routes should behave properly and respond with correct http codes", () => {
    
    test("It should return json containing all subject names staring with giver string paramether", async() => {
        const response = await agent
            .get("/subject?query=mech")
            .set('Cookie', [
                'token=c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0'
            ])
            .send()

        expect(response.status).toBe(200);
        
        expect(response.body[0]).toHaveProperty("name");
        expect(response.body[0]).toHaveProperty("sid");
        
    })


})