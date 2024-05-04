import supertest from "supertest";
import app from "../../app";

describe("Test protection against unauthenticated users", () => {
    it("Should respond with unauthenticated code to request without valid cookie", async () => {
        const response = await supertest(app).get("/auth/protected");
        expect(response.statusCode).toBe(401);
    })

})