export type OpenQuestion = {
    oqid: number,
    question: string,
    sid: number,
    rating?: number
}


//POST REQUEST DATA
export type OpenQuestionData = {
    question: string,
    rating?: number,
    sid: number
}

//DATABASE DATA
export type Question = {
    qid: number,
    uid: string,
    sid: number,
    oqid?: number,
    cqid?: number
}

export type OpenQuestionExtended = {
    qid: number,
    uid: string,
    sid: number,
    question: string
}

export type ChoiceQuestionExtended = {
    qid: number,
    uid: string,
    sid: number,
    question: string,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string,
    solution: number
}

//DATABASE DATA
export type ChoiceQuestion = {
    cqid: number,
    question: string,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string,
    solution: number,
    rating?: number,
    sid: number
}

// POST REQUEST DATA
export type ChoiceQuestionData = {
    question: string,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string,
    solution: number,
    sid: number
};

