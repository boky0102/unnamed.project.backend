export type ExamDB = {
    eid: number,
    uid: string,
    score?: number,
    open_questions?: number,
    choice_questions: number,
    subject_id: number
}