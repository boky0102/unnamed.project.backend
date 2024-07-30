import { ExamPrettyData } from "./exam.types"

export type SolutionDB = {
    solution_id: number,
    eid: number,
    solved_by: string,
    allow_random_review: boolean,
    started_at: Date,
    subject_name: string,
    score?: number,
    share_url?: string,
    pass_code?: string,
    finished?: boolean,
    checked_by?: string
     
}

export interface SolutionDBCamelCase  {
    solutionId: number,
    eid: number,
    solvedBy: string,
    allowRandomReview: boolean,
    startedAt: Date,
    score?: number,
    shareUrl?: string,
    passCode?: string,
    finished?: boolean,
    checkedBy?: string
}

type OpenQuestion = {
    qid: number,
    question: string,
    answer?: string
}

type ChoiceQuestion = {
    qid: number,
    question: string,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string
}

export interface SolutionExamData extends SolutionDBCamelCase {
    examData: ExamPrettyData
}

export type solutionAnswerDb = {
    solution_id: number,
    qid: number,
    user_answer: string,
    correct?: boolean
}