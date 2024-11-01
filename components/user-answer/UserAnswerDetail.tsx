"use client";

import React, { useEffect, useState } from "react";

import * as z from "zod";

import {
  Exam,
  QuestionPart1,
  QuestionPart2,
  QuestionPart3,
  QuestionPart4,
  QuestionPart5,
  QuestionPart6,
  QuestionPart7,
  TopicPart1,
  UserAnswer,
  UserAnswerDetail,
} from "@prisma/client";


import {
  Form,
 
} from "../ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Separator } from "../ui/separator";


import apiClient from "@/lib/api-client";
import { USER_API_ROUTES } from "@/ultis/api-route";
import Arr1 from "../part1-answer/Arr1";
import Arr2 from "../part2-answer/Arr2";
import Arr3 from "../part3-answer/Arr3";
import Arr4 from "../part4-answer/Arr4";
import Arr5 from "../part5-answer/Arr5";
import Arr6 from "../part6-answer/Arr6";
import Arr7 from "../part7-answer/Arr7";

interface UserAnswerFormProps {
  exam: ExamWithParts | null;
  userAnswerDetail: UserAnswerDetail[];
}

export type ExamWithParts = Exam & {
  part1s: QuestionPart1[];
  part2s: QuestionPart2[];
  part3s: QuestionPart3[];
  part4s: QuestionPart4[];
  part5s: QuestionPart5[];
  part6s: QuestionPart6[];
  part7s: QuestionPart7[];
  
};

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Description must be atleast 3 characters long",
  }),
  description: z.string().min(10, {
    message: "Description must be atleast 10 characters long",
  }),
  audioFile: z.string().min(1, { message: "Audio is required" }),
});

const UserAnswerDeltail = ({ exam, userAnswerDetail }: UserAnswerFormProps) => {
  const [topics, setTopics] = useState<TopicPart1[]>([]);

  const [details, setDetails] = useState<UserAnswerDetail[]>([]);

  type PartType =
    | "part1"
    | "part2"
    | "part3"
    | "part4"
    | "part5"
    | "part6"
    | "part7"; // Ví dụ về các giá trị cụ thể

  // Đối với từng part khi nhấn vào thì sẽ là 1 form nhập liệu cho từng part
  const [openDialog, setOpenDialog] = useState<PartType | null>(null);

  // Ứng với từng part của exam thì sẽ có dialog để nhập dữ liệu riêng
  const handleDialogOpen = (part: PartType) => {
    setOpenDialog((prev) => (prev === part ? null : part));
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: exam || {
      title: "",
      description: "",
      audioFile: "",
    },
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(USER_API_ROUTES.GET_DETAIL);
        console.log("API Response:", response.data); // Log the entire response

        if (response.data.details) {
          setDetails(response.data.details); // Correctly set the topics array
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, []);



  function onSubmit(values: z.infer<typeof formSchema>){
    
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="w-full md:w-[100%] flex flex-col gap-6">
          {exam && !!exam.part1s.length && (
            <div>
              <h3>Part 1</h3>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
              {exam.part1s.map((part1, index) => {
      // Find the answer for the current part1 based on questionId
      const userAnswerDetail = details.find(detail => detail.questionId === part1.id) || null;

      return (
        <Arr1
          key={part1.id}
          exam={exam}
          part1={part1}
          index={index} // Pass the index correctly
          topics={topics}
          userAnswerDetail={userAnswerDetail} // Pass the corresponding userAnswerDetail
        />
      );
    })}
              </div>
            </div>
          )}

{exam && !!exam.part2s.length && (
            <div>
              <h3>Part 2</h3>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
              {exam.part2s.map((part2, index) => {
      // Find the answer for the current part1 based on questionId
      const userAnswerDetail = details.find(detail => detail.questionId === part2.id) || null;

      return (
        <Arr2
          key={part2.id}
          exam={exam}
          part2={part2}
          index={index} // Pass the index correctly
          topics={topics}
          userAnswerDetail={userAnswerDetail} // Pass the corresponding userAnswerDetail
        />
      );
    })}
              </div>
            </div>
          )}

{exam && !!exam.part3s.length && (
            <div>
              <h3>Part 3</h3>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
              {exam.part3s.map((part3, index) => {
      // Find the answer for the current part1 based on questionId
      const userAnswerDetail = details.find(detail => detail.questionId === part3.id) || null;

      return (
        <Arr3
          key={part3.id}
          exam={exam}
          part3={part3}
          index={index} // Pass the index correctly
          topics={topics}
          userAnswerDetail={userAnswerDetail} // Pass the corresponding userAnswerDetail
        />
      );
    })}
              </div>
            </div>
          )}

{exam && !!exam.part4s.length && (
            <div>
              <h3>Part 4</h3>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
              {exam.part4s.map((part4, index) => {
      // Find the answer for the current part1 based on questionId
      const userAnswerDetail = details.find(detail => detail.questionId === part4.id) || null;

      return (
        <Arr4
          key={part4.id}
          exam={exam}
          part4={part4}
          index={index} // Pass the index correctly
          topics={topics}
          userAnswerDetail={userAnswerDetail} // Pass the corresponding userAnswerDetail
        />
      );
    })}
              </div>
            </div>
          )}

{exam && !!exam.part5s.length && (
            <div>
              <h3>Part 5</h3>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
              {exam.part5s.map((part5, index) => {
      // Find the answer for the current part1 based on questionId
      const userAnswerDetail = details.find(detail => detail.questionId === part5.id) || null;

      return (
        <Arr5
          key={part5.id}
          exam={exam}
          part5={part5}
          index={index} // Pass the index correctly
          topics={topics}
          userAnswerDetail={userAnswerDetail} // Pass the corresponding userAnswerDetail
        />
      );
    })}
              </div>
            </div>
          )}

{exam && !!exam.part6s.length && (
            <div>
              <h3>Part 6</h3>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
              {exam.part6s.map((part6, index) => {
      // Find the answer for the current part1 based on questionId
      const userAnswerDetail = details.find(detail => detail.questionId === part6.id) || null;

      return (
        <Arr6
          key={part6.id}
          exam={exam}
          part6={part6}
          index={index} // Pass the index correctly
          topics={topics}
          userAnswerDetail={userAnswerDetail} // Pass the corresponding userAnswerDetail
        />
      );
    })}
              </div>
            </div>
          )}

{exam && !!exam.part7s.length && (
            <div>
              <h3>Part 7</h3>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
              {exam.part7s.map((part7, index) => {
      // Find the answer for the current part1 based on questionId
      const userAnswerDetail = details.find(detail => detail.questionId === part7.id) || null;

      return (
        <Arr7
          key={part7.id}
          exam={exam}
          part7={part7}
          index={index} // Pass the index correctly
          topics={topics}
          userAnswerDetail={userAnswerDetail} // Pass the corresponding userAnswerDetail
        />
      );
    })}
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default UserAnswerDeltail;
