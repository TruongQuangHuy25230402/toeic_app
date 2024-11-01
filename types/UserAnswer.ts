export interface UserAnswerDetail {
    id: string;
    isCorrect: boolean;
    selectedAnswer: string;
    questionId: string;
}

export interface UserAnswer {
    scoreListening: number;
    scoreReading: number;
    totalScore: number;
    UserAnswerDetail: UserAnswerDetail[];
}
