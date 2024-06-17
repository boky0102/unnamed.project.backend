type OpenQuestion = {
    oqid: number,
    question: string,
    sid: number,
    rating?: number
}

type OpenQuestionData = {
    question: string,
    rating?: number,
    sid: number
}

type Question = {
    qid: number,
    uid: string,
    sid: number,
    oqid?: number,
    cqid?: number
}