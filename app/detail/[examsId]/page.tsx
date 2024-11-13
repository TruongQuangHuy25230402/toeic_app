
import { getExamsById } from "@/actions/getExamsById";
import ExamClient from "@/components/exams/ExamsClient";
import React from "react";

interface ExamDetailsProps {
  params: {
    examsId: string;
  };
}



const ExamDetails = async ({ params }: ExamDetailsProps) => {
  const exam = await getExamsById(params.examsId);
  if (!exam) return <div>Oop! Exam with the given Id not found.</div>;
  return <ExamClient exam={exam} />
};

export default ExamDetails;
