export interface Questions {
    id: string;
    audioFile: string;
    imageFile: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    correctAnswer: string;
    explainAnswer: string;
    createdAt: Date;
    updatedAt: Date;
    examsId: string;
    userId: string;
    groupId?: string; // optional field
  
    // You can also include the related `Exams` type if needed
    // exams?: Exams;
  }
  
  // If you want to define the `Exams` type as well:
  export interface Exams {
    id: string;
    // add other fields as needed
  }