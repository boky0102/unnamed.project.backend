import { ExamChoiceQuestion, ExamOpenQuestion } from "../Types/exam.types";

export const parseQID = async (openQuestions: ExamOpenQuestion[], choiceQuestions: ExamChoiceQuestion[]) : Promise<number[]> => {

    const qidArray: number[] = [];
    choiceQuestions.forEach((question) => qidArray.push(question.qid));

    openQuestions.forEach((question) => qidArray.push(question.qid));

    return qidArray;
}