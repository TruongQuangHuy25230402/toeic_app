import axios from 'axios';

// Fetch exams
export const fetchExams = async () => {
  try {
    const response = await axios.get('/api/exams');
    return response.data.exams;
  } catch (error) {
    console.error("Error fetching exams:", error);
    throw error;
  }
};

// Fetch questions
export const fetchQuestions = async () => {
  try {
    const response = await axios.get('/api/ques');
    return response.data.questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const fetchExamQuestions = async (examId?: string) => {
  try {
    // If examId is provided, include it as a query parameter
    const url = examId ? `/api/examQuestion?examId=${examId}` : '/api/examQuestion';

    const response = await axios.get(url);  // Make the GET request

    return response.data;  // Return the fetched data
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};


// Submit the exam-question relation
export const submitExamQuestionRelation = async (exams: string[], questions: string[]) => {
  try {
    // Create an array of objects with each exam-question pair
    const examQuestionPairs = exams.flatMap((examId) =>
      questions.map((questionId) => ({ examId, questionId }))
    );

    // Send data to backend
    const response = await axios.post('/api/examQuestion', { examQuestionPairs });
    return response.data; // Expecting a response from server with a success message or errors
  } catch (error) {
    console.error('Error submitting exam-question relation:', error);
    throw error;
  }
};


export const fetchExamsCountForQuestion = async (id: string) => {
  try {
    const response = await axios.get(`/api/examQuestion/${id}`); // Make GET request to the API
    return response.data.count; // Return the count of exams related to the question
  } catch (error) {
    console.error("Error fetching exams count:", error);
    return 0; // Return 0 if there's an error
  }
};