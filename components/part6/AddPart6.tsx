"use client";

import { Exam, QuestionPart6, TopicPart6 } from "@prisma/client";
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
import Image from "next/image";
import { Button } from "../ui/button";
import { Loader2, Pencil, PencilLine, XCircle } from "lucide-react";
import { UploadButton } from "../uploadthing";
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
  | "part4"
  | "part5"
  | "part6"
  | "part7";

interface AddPart6FormProps {
  exam?: Exam & {
    part6s: QuestionPart6[];
  };
  part6?: QuestionPart6;
  handleDialogueOpen: (part: PartType) => void;
  topics: TopicPart6[];
}

const formSchema = z.object({
  imageFile: z.string().optional(), // cho phép trường này trống
  answer1: z.string().min(1, { message: "must be atleast 6 characters long." }),
  answer2: z.string().min(1, { message: "must be atleast 6 characters long." }),
  answer3: z.string().min(1, { message: "must be atleast 6 characters long." }),
  answer4: z.string().min(1, { message: "must be atleast 6 characters long." }),
  topicId: z.string().nullable(),
  correctAnswer: z
    .string()
    .min(1, { message: "must be atleast 6 characters long." }), // Đáp án đúng
  explainAnswer: z
    .string()
    .min(3, { message: "must be atleast 3 characters long." }),
});

const AddPart6 = ({ exam, part6, handleDialogueOpen }: AddPart6FormProps) => {
  const [image, setImage] = useState<string | undefined>(part6?.imageFile);

  const [imageIsDeleting, setImageIsDeleting] = useState(false);

  const [topics, setTopics] = useState<TopicPart6[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: part6 || {
      imageFile: "",
      answer1: "A",
      answer2: "B",
      answer3: "C",
      answer4: "D",
      correctAnswer: "", // Đáp án đúng
      explainAnswer: "",
      topicId: "",
    },
  });

  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("imageFile", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
    //eslint-disable-next-line
  }, [image]);


  const handleImageDelete = (image: string) => {
    setImageIsDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage("");
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
        setImageIsDeleting(false);
      });
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await apiClient.get(USER_API_ROUTES.GET_TOPICS_PART6);

        if (response.data.topics) {
          setTopics(response.data.topics); // Correctly set the topics array
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);



  const handleOpenDialogue = () => {
    // Assuming you want to open the dialogue for "part6"
    handleDialogueOpen("part6");
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (exam && part6) {
      axios
        .patch(`/api/part6/${part6.id}`, values)
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

        .post("/api/part6", { ...values, examId: exam.id })
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
      }}
  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form className="space-y-6">

        

<FormField
            control={form.control}
            name="imageFile"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>Upload an Image</FormLabel>
                <FormDescription>
                  Choose an image that will show-case your Exam nicely
                </FormDescription>
                <FormControl>
                  {image ? (
                    <>
                      <div className="relative max-w-[600px] min-w-[200px] max-h-[600px] min-h-[200px] mt-6">
                        <Image
                          fill
                          src={image}
                          alt="Exam Image"
                          className="object-contain"
                        />
                        <Button
                          onClick={() => handleImageDelete(image)}
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="absolute right-[-12px] top-0"
                        >
                          {imageIsDeleting ? <Loader2 /> : <XCircle />}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="flex flex-col items-center max-w-[6000px] p-12 border-2 border-dashed
                          border-primary/50 rounded mt-6"
                      >
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            console.log("Files: ", res);
                            setImage(res[0].url);
                            toast({
                              variant: "default",
                              description: "Upload Completed",
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
          
          
        <Separator/>
          <div className="pt-6 pb-2">
            {part6 ? (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                type="button"
                className="max-w-[650px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6" />
                    Updating
                  </>
                ) : (
                  <>
                    <PencilLine className="mr-2 h-6 w-6" />
                    Update
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  type="button"
                  className="max-w-[650px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6" />
                      Creating
                    </>
                  ) : (
                    <>
                      <Pencil className="mr-2 h-6 w-6" />
                      Create Question
                    </>
                  )}


                </Button>
              </>
            )}
          <div className="mt-2">
            <Separator />
         
          </div>
          
          
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddPart6;
