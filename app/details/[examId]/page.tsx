import { getExamById } from "@/actions/getExamById";
import ExamDetailClient from "@/components/exam/ExamDetailClient";
import React from "react";

interface ExamDetailsProps {
  params: {
    examId: string;
  };
}



const ExamDetails = async ({ params }: ExamDetailsProps) => {
  const exam = await getExamById(params.examId);
  if (!exam) return <div>Oop! Exam with the given Id not found.</div>;
  return <ExamDetailClient exam={exam} />;
};

export default ExamDetails;
