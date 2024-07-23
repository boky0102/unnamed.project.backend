import { initializeDB, pool } from "../../services/db.services";
import { generateSolution, getSolution } from "../../services/solution.services";
import { HttpException } from "../../Types/error";
import { SolutionDB, SolutionDBCamelCase } from "../../Types/solution.types";

afterAll(async () => {
    await initializeDB();
    await pool.end();
})

describe("Testing services for handling with solution data", () => {
    test("Method for getting solution should return solution when provided with valid id", async () => {
        const solution = await getSolution(1);
        console.log(solution);
        expect(solution).toMatchObject<SolutionDBCamelCase>({
            eid: 1,
            solutionId: 1,
            passCode: "random-pass-code",
            solvedBy: "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0",
            allowRandomReview: true
        })
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

})


