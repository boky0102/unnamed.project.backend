export type SolutionDB = {
    solution_id: number,
    eid: number,
    solved_by: string,
    allow_random_review: boolean,
    started_at: Date,
    score?: number,
    share_url?: string,
    pass_code?: string,
    finished?: boolean,
    checked_by?: string,
}

export type SolutionDBCamelCase = {
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