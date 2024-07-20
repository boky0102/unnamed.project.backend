export type ExamDB = {
    eid: number,
    uid: string,
    score?: number,
    open_questions?: number,
    choice_questions: number,
    subject_id: number
}

export type ExamData = {
    open_questions: ExamOpenQuestion[],
    choice_questions: ExamChoiceQuestion[],
    eid: number,
    sid: number
}

export type ExamOpenQuestion = {
    qid: number,
    question: string
}

export type ExamChoiceQuestion = {
    qid: number,
    question: string,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string
}



export type ExamQuestion = {
    eid: number,
    qid: number
}