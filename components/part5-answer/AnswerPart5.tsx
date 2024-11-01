"use client";

import { Exam, QuestionPart5, TopicPart5 } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Pencil, PencilLine, Trash, XCircle } from "lucide-react";
import { toast } from "../ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css"; // Import stylesheet
import dynamic from "next/dynamic";
import { Separator } from "../ui/separator";
import apiClient from "@/lib/api-client";
import { USER_API_ROUTES } from "@/ultis/api-route";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type PartType =
  | "part1"
  | "part2"
  | "part3"
  | "part5"
  | "part5"
  | "part6"
  | "part7";

interface AddPart5FormProps {
  exam?: Exam & {
    part5s: QuestionPart5[];
  };
  part5?: QuestionPart5;
  handleDialogueOpen: (part: PartType) => void;
  topics: TopicPart5[];
}

const formSchema = z.object({
  questionText: z
    .string()
    .min(5, { message: "must be atleast 5 characters long." }),
  answer1: z.string().min(1, { message: "must be atleast 5 characters long." }),
  answer2: z.string().min(1, { message: "must be atleast 5 characters long." }),
  answer3: z.string().min(1, { message: "must be atleast 5 characters long." }),
  answer4: z.string().min(1, { message: "must be atleast 5 characters long." }),
  topicId: z.string().nullable(),
  correctAnswer: z
    .string()
    .min(1, { message: "must be atleast 5 characters long." }), // Đáp án đúng
  explainAnswer: z
    .string()
    .min(3, { message: "must be atleast 3 characters long." }),
});

const AnswerPart5 = ({ exam, part5, handleDialogueOpen }: AddPart5FormProps) => {
  const [imageIsDeleting, setImageIsDeleting] = useState(false);

  const [audioIsDeleting, setAudioIsDeleting] = useState(false);

  const [topics, setTopics] = useState<TopicPart5[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: part5 || {
      questionText: "",
      answer1: "A",
      answer2: "B",
      answer3: "C",
      answer4: "D",
      correctAnswer: "", // Đáp án đúng
      explainAnswer: "",
      topicId: "",
    },
  });

  const handleOpenDialogue = () => {
    // Assuming you want to open the dialogue for "part5"
    handleDialogueOpen("part5");
  };

  const handleQuestionDelete = (part5: QuestionPart5) => {
    setIsLoading(true);
    axios
      .delete(`/api/part5/${part5.id}`)
      .then(() => {
        router.refresh();
        toast({
          variant: "default",
          description: "Question Delete!",
        });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Something went wrong!",
        });
      });
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await apiClient.get(USER_API_ROUTES.GET_TOPICS_PART5);

        if (response.data.topics) {
          setTopics(response.data.topics); // Correctly set the topics array
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (exam && part5) {
      axios
        .patch(`/api/part5/${part5.id}`, values)
        .then((res) => {
          toast({
            variant: "default",
            description: "Question Update!",
          });
          router.refresh();
          setIsLoading(false);
          handleOpenDialogue();
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Some thing went wrong!",
          });
          setIsLoading(false);
        });
    } else {
      if (!exam) return;
      axios

        .post("/api/part5", { ...values, examId: exam.id })
        .then((res) => {
          toast({
            variant: "default",
            description: "Question created.",
          });
          router.refresh();
          setIsLoading(false);
          handleOpenDialogue();
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Some thing went wrong!",
          });
          setIsLoading(false);
        });
    }
  }
  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="questionText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Text</FormLabel>

                <FormControl>
                  <Input placeholder="Question Text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="answer1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer 1</FormLabel>

                <FormControl>
                  <Input placeholder="Answer 1" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="answer2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer 2</FormLabel>

                <FormControl>
                  <Input placeholder="Answer 2" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="answer3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer 3</FormLabel>

                <FormControl>
                  <Input placeholder="Answer 3" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="answer4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer 4</FormLabel>

                <FormControl>
                  <Input placeholder="Answer 4" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="correctAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>correctAnswer</FormLabel>

                <FormControl>
                  <Input placeholder="correctAnswer" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Topic *</FormLabel>
                <FormDescription>
                  Please select the topic related to your content
                </FormDescription>
                <Select
                  disabled={isLoading}
                  onValueChange={(value) => field.onChange(value)} // Handle value change
                  value={field.value ?? ""} // Single string value
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="explainAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explain Answer</FormLabel>

                <FormControl>
                  <ReactQuill
                    placeholder="Explain Answer!"
                    value={field.value}
                    onChange={field.onChange}
                    style={{
                      height: "300px",
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </form>
      </Form>
    </div>
  );
};

export default AnswerPart5;
