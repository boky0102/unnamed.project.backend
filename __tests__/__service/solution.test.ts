import { initializeDB, pool } from "../../services/db.services";
import { generateSolution, getSolution, getSolutionsByUserId } from "../../services/solution.services";
import { HttpException } from "../../Types/error";
import { SolutionDB, SolutionDBCamelCase } from "../../Types/solution.types";

afterAll(async () => {
    await initializeDB();
    await pool.end();
})

describe("Testing services for handling with solution data", () => {
    test("Method for getting solution should return solution when provided with valid id", async () => {
        const solution = await getSolution(1);
        const now = new Date();

        expect(solution.eid).toBe(1);
        expect(solution.solutionId).toBe(1);
        expect(solution.passCode).toBe("random-pass-code");
        expect(solution.solvedBy).toBe("c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        expect(solution.allowRandomReview).toBe(true);

        const timeDiff = solution.startedAt.getTime() - now.getTime();
        expect(Math.abs(timeDiff) < 1000).toBe(true);
    });
    test("Method for getting solution should throw when provided with non existing solution id", async () => {
        await expect(async () => {
            return await getSolution(999);
        }).rejects.toThrow(new HttpException(404, "Solution with given id does not exist"))
    })
 
    test("Method for generating a new solution should create new solution when provided with valid data", async () => {
        const newSolutionId = await generateSolution(1, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0", true);
        expect(newSolutionId).toBe(3);
    })
    test("Method for generating a new solution should throw when given non existing exam id", async () => {
        await expect(async () => {
            return await generateSolution(999, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0", true)
        }).rejects.toThrow(new HttpException(400, "Exam or user with given id does not exist"));
    });

    test("Method for getting solutions created by given user should return all solutions made by user", async () => {
        const solutions = await getSolutionsByUserId("c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        solutions.forEach((solution) => {
            expect(solution).toHaveProperty("solutionId");
            expect(solution).toHaveProperty("eid");
            expect(solution).toHaveProperty("solvedBy");
            expect(solution).toHaveProperty("allowRandomReview");
        })
    })
    test("Method for getting solutions by user id should throw when given non existing user id", async () => {
        await expect(async () => {
            return await getSolutionsByUserId("c1f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        }).rejects.toThrow(new HttpException(400, "There are no solutions made by given user"))
    })

})

