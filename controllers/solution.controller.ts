import { NextFunction, Request, Response } from "express";
import {
    commitSolution,
    generateSolution,
    getSolution,
    getSolutionsByUserId,
    saveAnswer,
} from "../services/solution.services";
import { HttpException } from "../Types/error";
import { httpExceptionHandler } from "../middleware/error.middleware";
import { pool } from "../services/db.services";
import { userRouter } from "../routes/users";

export const getSolutionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const solutionId = req.params.id;
        if (solutionId && typeof solutionId === "string" && !Number.isNaN(parseInt(solutionId))) {
            const solutionData = await getSolution(parseInt(solutionId));
            res.status(200).json(solutionData).send();
        } else {
            throw new HttpException(400, "Bad request, please provide solution id in url");
        }
    } catch (error) {
        next(error);
    }
};

export const getAllSolutionsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.userID) {
            const solutions = await getSolutionsByUserId(req.userID);
            res.json(solutions).status(200).send();
        } else {
            throw new HttpException(401, "Cannot get solutions while unauthorized");
        }
    } catch (error) {
        next(error);
    }
};

export const generateSolutionController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.userID;
        const examId = req.body.examId;
        const randomReviewer = req.body.randomReviewer;

        if (!userId || !examId || randomReviewer === undefined) {
            throw new HttpException(
                400,
                "Request query parameters missing/wrong or user unauthenticated"
            );
        } else {
            if (typeof examId !== "number" || typeof randomReviewer !== "boolean") {
                throw new HttpException(
                    400,
                    "Exam id must be a number and random reviewer should be boolean"
                );
            } else {
                const newSolutionId = await generateSolution(examId, userId, randomReviewer);
                res.status(201)
                    .json({
                        solutionId: newSolutionId,
                    })
                    .send();
            }
        }
    } catch (error) {
        next(error);
    }
};

export const saveSolutionAnswerController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userID = req.userID;
        const { solutionId, qid, answer } = req.body;

        if (!userID || !solutionId || !qid || !answer) {
            throw new HttpException(
                400,
                "Missing values in request body, please make sure solution id, question id and answer text are present"
            );
        } else {
            if (
                typeof solutionId !== "number" ||
                typeof qid !== "number" ||
                typeof answer !== "string"
            ) {
                throw new HttpException(
                    400,
                    "Request data object contains wrong types on properties"
                );
            } else {
                await saveAnswer(solutionId, qid, answer, userID);
                res.status(200).send();
            }
        }
    } catch (error) {
        next(error);
    }
};

export const commitSolutionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userID = req.userID;
        const solutionID = parseInt(req.params.solutionid);
        if (!userID || !solutionID || typeof solutionID !== "number") {
            throw new HttpException(400, "Bad url parameters");
        } else {
            await commitSolution(solutionID, userID);
            res.status(200).send();
        }
    } catch (error) {
        next(error);
    }
};
