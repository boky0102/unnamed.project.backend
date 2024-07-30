import { initializeDB, pool } from "../../services/db.services";
import { getExam } from "../../services/exam.services";
import { generateSolution, getSolution, getSolutionsByUserId, saveAnswer } from "../../services/solution.services";
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

        const exam = await getExam(solution.eid);

        expect(solution.eid).toBe(1);
        expect(solution.solutionId).toBe(1);
        expect(solution.passCode).toBe("random-pass-code");
        expect(solution.solvedBy).toBe("c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        expect(solution.allowRandomReview).toBe(true);
        expect(solution.examData).toMatchObject(exam);

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
            expect(solution).toHaveProperty("subjectName");
            expect(solution).toHaveProperty("startedAt");
        })
    })
    test("Method for getting solutions by user id should throw when given non existing user id", async () => {
        await expect(async () => {
            return await getSolutionsByUserId("c1f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        }).rejects.toThrow(new HttpException(400, "There are no solutions made by given user"))
    })

    test("Method for saving solution to the question should save question successfully", async () => {
        const solutionAnswerSaved = await saveAnswer(1, 1, "4", "choice");
        expect(solutionAnswerSaved).toBe(true);
        const changeAnswer = await saveAnswer(1,1,"3", "choice");
        expect(changeAnswer).toBe(true);
    });
    test("Method for saving solution of the question should throw if given invalid qid or solutionId parameters", async () => {
        await expect(async () => {
            return await saveAnswer(999,1,"4","choice");
        }).rejects.toThrow(new HttpException(400, "Invalid given parameters, given solutionId or qid don't exist in the db"));

        await expect(async () => {
            return await saveAnswer(1, 9999, "3", "choice");
        }).rejects.toThrow(new HttpException(400, "Invalid given parameters, given solutionId or qid don't exist in the db"));
    })

})


