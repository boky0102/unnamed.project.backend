import { initializeDB, pool } from "../../services/db.services";
import { getExam } from "../../services/exam.services";
import { commitSolution, generateSolution, getSolution, getSolutionChoiceQuestions, getSolutionsByUserId, getSolutionUserAnswers, saveAnswer } from "../../services/solution.services";
import { HttpException } from "../../Types/error";
import { SolutionAnswerObject, SolutionAnswersObject } from "../../Types/solution.types";

afterAll(async () => {
    await initializeDB();
    await pool.end();
})

describe("Testing services for handling with solution data", () => {
    test("Method for getting solution should return solution when provided with valid id", async () => {
        const solution = await getSolution(1);

        const exam = await getExam(solution.eid);

        expect(solution.eid).toBe(1);
        expect(solution.solutionId).toBe(1);
        expect(solution.passCode).toBe("random-pass-code");
        expect(solution.solvedBy).toBe("c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        expect(solution.allowRandomReview).toBe(true);
        expect(solution.examData).toMatchObject(exam);
        expect(solution.startedAt).toMatchObject(new Date(2024, 4, 5, 12));

        
    });
    test("Method for getting solution should throw when provided with non existing solution id", async () => {
        await expect(async () => {
            return await getSolution(999);
        }).rejects.toThrow(new HttpException(404, "Solution with given id does not exist"))
    })
 
    test("Method for generating a new solution should create new solution when provided with valid data", async () => {
        const now = new Date();

        const newSolutionId = await generateSolution(1, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0", true);

        const newSolution = await getSolution(newSolutionId);

        const timeDiff = newSolution.startedAt.getTime() - now.getTime();
        expect(Math.abs(timeDiff) < 1000).toBe(true);
        expect(newSolution.solutionId).toBe(newSolutionId);

        
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
        const solutionAnswerSaved = await saveAnswer(1, 1, "4", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        expect(solutionAnswerSaved).toBe(true);
        const changeAnswer = await saveAnswer(1,1,"3", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        expect(changeAnswer).toBe(true);
    });
    test("Method for saving solution of the question should throw if given invalid qid or solutionId parameters", async () => {
        await expect(async () => {
            return await saveAnswer(999,1,"4", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        }).rejects.toThrow(new HttpException(400, "Solution with given id does not exist"));

        await expect(async () => {
            return await saveAnswer(1, 9999, "3", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        }).rejects.toThrow(new HttpException(400, "Invalid given parameters, given solutionId or qid don't exist in the db"));
    })
    test("Method for saving solution should throw if tried to save solution answer of solution that was finished", async () => {
        await expect(async() => {
            await saveAnswer(1, 1, "2", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
            await commitSolution(1, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
            return await saveAnswer(1, 2, "3", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        }).rejects.toThrow(new HttpException(400, "Solution with given id has already been solved"));
    })

    test("Method for commiting solution should update solution as finished", async () => {
        await commitSolution(1, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        const solution = await getSolution(1);
        expect(solution.finished).toBe(true);
    });
    test("Method for commiting solution should check all choice question answers when commited", async () => {
        const solutionId = await generateSolution(1, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0", true);
        await saveAnswer(solutionId, 1, "2", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        await saveAnswer(solutionId, 3, "4", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        await commitSolution(solutionId, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        const userSolutionsChecked = await getSolutionUserAnswers(solutionId);
        expect(userSolutionsChecked).toMatchObject<SolutionAnswersObject>({
            1: {
                correct: true,
                userAnswer: "2"
            },
            3: {
                correct: false,
                userAnswer: "4"
            }
        })
    });
    test("Method for commiting solution should throw if given non-existing solution id or user id", async () => {
        await expect(async () => {
            await commitSolution(999, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        }).rejects.toThrow(new HttpException(404, "Can't find exam with given solution id"));

        await expect(async () => {
            await commitSolution(1, "d0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        }).rejects.toThrow(new HttpException(404, "Can't find exam with given solution id"));
    })

    test("Method for getting solution's choice questions and answers should return valid data", async () => {
        const solutionId = await generateSolution(1, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0", true);
        await saveAnswer(solutionId, 1, "2", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        await saveAnswer(solutionId, 3, "4", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        const solutionChoiceQuestions = await getSolutionChoiceQuestions(solutionId);
        expect(solutionChoiceQuestions).toMatchObject<SolutionAnswerObject>({
            1: "2",
            3: "4"
        });
    })

    test("Method for getting solution answers should return valid data", async() => {
        const solutionId = await generateSolution(1, "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0", true);
        await saveAnswer(solutionId, 1, "2", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        await saveAnswer(solutionId, 3, "4", "c0f3d84e-79e0-4e69-ae72-ae3bc78b61d0");
        const userAnswers = await getSolutionUserAnswers(solutionId);
        expect(userAnswers).toMatchObject<SolutionAnswersObject>({
            1: {
                userAnswer: "2",

            },
            3: {
                userAnswer: "4",
            }
        });
    })


})


