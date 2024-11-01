"use client";

import { Exam, QuestionPart2, TopicPart2 } from "@prisma/client";
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
import { UploadButton } from "../uploadthing";
import { toast } from "../ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css"; // Import stylesheet
import dynamic from "next/dynamic";
import { Separator } from "../ui/separator";
import { USER_API_ROUTES } from "@/ultis/api-route";
import apiClient from "@/lib/api-client";
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
  | "part4"
  | "part5"
  | "part6"
  | "part7";

interface AddPart2FormProps {
  exam?: Exam & {
    part2s: QuestionPart2[];
  };
  part2?: QuestionPart2;
  handleDialogueOpen: (part: PartType) => void;
  topics: TopicPart2[];
}

const formSchema = z.object({
  audioFile: z.string().min(2, { message: "Audio is required" }),
  answer1: z.string().min(1, { message: "must be atleast 1 characters long." }),
  answer2: z.string().min(1, { message: "must be atleast 1 characters long." }),
  answer3: z.string().min(1, { message: "must be atleast 1 characters long." }),
  topicId: z.string().nullable(), // Change this to a single string,
  correctAnswer: z
    .string()
    .min(1, { message: "must be atleast 1 characters long." }), // Đáp án đúng
  explainAnswer: z
    .string()
    .min(3, { message: "must be atleast 3 characters long." }),
});

const AnswerPart2 = ({ exam, part2, handleDialogueOpen }: AddPart2FormProps) => {
  const [audio, setAudio] = useState<string | undefined>(part2?.audioFile);

  const [audioIsDeleting, setAudioIsDeleting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [topics, setTopics] = useState<TopicPart2[]>([]);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: part2 || {
      audioFile: "",
      answer1: "A",
      answer2: "B",
      answer3: "C",
      correctAnswer: "", // Đáp án đúng
      explainAnswer: "",
      topicId: "",
    },
  });

  useEffect(() => {
    if (typeof audio === "string") {
      form.setValue("audioFile", audio, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
    //eslint-disable-next-line
  }, [audio]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await apiClient.get(USER_API_ROUTES.GET_TOPICS_PART2);

        if (response.data.topics) {
          setTopics(response.data.topics); // Correctly set the topics array
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  const handleAudioDelete = (audio: string) => {
    setAudioIsDeleting(true);
    const audioKey = audio.substring(audio.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { audioKey })
      .then((res) => {
        if (res.data.success) {
          setAudio("");
          toast({
            variant: "default",
            description: "Image removed",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      })
      .finally(() => {
        setAudioIsDeleting(false);
      });
  };

  const handleOpenDialogue = () => {
    // Assuming you want to open the dialogue for "part2"
    handleDialogueOpen("part2");
  };

  const handleQuestionDelete = (part2: QuestionPart2) => {
    setIsLoading(true);
    axios
      .delete(`/api/part2/${part2.id}`)
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    
  }
  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="audioFile"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>Upload an Audio File</FormLabel>
                <FormDescription>
                  Choose an audio file that will complement your Exam.
                </FormDescription>
                <FormControl>
                  {audio ? (
                    <>
                      <div className="relative max-w-[400px] min-w-[200px] mt-4">
                        <audio controls>
                          <source src={audio} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                        <Button
                          onClick={() => handleAudioDelete(audio)}
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="absolute right-[-12px] top-[-12px]"
                        >
                          {audioIsDeleting ? <Loader2 /> : <XCircle />}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="flex flex-col items-center max-w-[4000px] p-12 border-2 border-dashed
                border-primary/50 rounded mt-4"
                      >
                        <UploadButton
                          endpoint="audioUploader"
                          onClientUploadComplete={(res) => {
                            console.log("Files: ", res);
                            setAudio(res[0].url);
                            toast({
                              variant: "default",
                              description: "Audio upload completed.",
                            });
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </div>
                    </>
                  )}
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

export default AnswerPart2;
