type OpenQuestion = {
    oqid: number,
    question: string,
    sid: number,
    rating?: number
}


//POST REQUEST DATA
type OpenQuestionData = {
    question: string,
    rating?: number,
    sid: number
}

//DATABASE DATA
type Question = {
    qid: number,
    uid: string,
    sid: number,
    oqid?: number,
    cqid?: number
}


//DATABASE DATA
type ChoiceQuestion = {
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
type ChoiceQuestionData = {
    question: string,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string,
    solution: number,
    sid: number
};