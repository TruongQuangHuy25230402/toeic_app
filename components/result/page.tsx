import React, { useState } from 'react';
import { UserAnswer, Exam, 
    QuestionPart1, 
    QuestionPart2,
    QuestionPart3,
    QuestionPart4,
    QuestionPart5,
    QuestionPart6,
    QuestionPart7,
    TopicPart1,
    TopicPart2,
    TopicPart3,
    TopicPart4,
    TopicPart5,
    TopicPart6,
    TopicPart7
} from "@prisma/client";

interface myResultProps {
    result: UserAnswer & {
        Exam: Exam | null;
        TopicPart1: TopicPart1 | null;
        TopicPart2: TopicPart2 | null;
        TopicPart3: TopicPart3 | null;
        TopicPart4: TopicPart4 | null;
        TopicPart5: TopicPart5 | null;
        TopicPart6: TopicPart6 | null;
        TopicPart7: TopicPart7 | null;
        QuestionPart1: QuestionPart1 | null;
        QuestionPart2: QuestionPart2 | null;
        QuestionPart3: QuestionPart3 | null;
        QuestionPart4: QuestionPart4 | null;
        QuestionPart5: QuestionPart5 | null;
        QuestionPart6: QuestionPart6 | null;
        QuestionPart7: QuestionPart7 | null;
    };
}

const ResultPage: React.FC<myResultProps> = ({ result }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [submitIsLoading, setSubmitIsLoading] = useState(false);

    const {
        Exam,
        TopicPart1,
        TopicPart2,
        TopicPart3,
        TopicPart4,
        TopicPart5,
        TopicPart6,
        TopicPart7,
        QuestionPart1,
        QuestionPart2,
        QuestionPart3,
        QuestionPart4,
        QuestionPart5,
        QuestionPart6,
        QuestionPart7,
    } = result;

    // Check if any required data is missing
    const isMissingData = !Exam || !TopicPart1 || !TopicPart2 || !TopicPart3 || 
                          !TopicPart4 || !TopicPart5 || !TopicPart6 || !TopicPart7 ||
                          !QuestionPart1 || !QuestionPart2 || !QuestionPart3 || 
                          !QuestionPart4 || !QuestionPart5 || !QuestionPart6 || !QuestionPart7;

    if (isMissingData) {
        return <div>Missing Data...</div>;
    }

    const handleSubmit =()=>{
        setSubmitIsLoading(true)
        const resultData = {
            questionPart1: QuestionPart1,
            questionPart2: QuestionPart2,
            questionPart3: QuestionPart3,
            questionPart4: QuestionPart4,
            questionPart5: QuestionPart5,
            questionPart6: QuestionPart6,
            questionPart7: QuestionPart7,
            
        }
    }

    return (
        <div>
            <h1>Result Page</h1>
          
        </div>
    );
};

export default ResultPage;
