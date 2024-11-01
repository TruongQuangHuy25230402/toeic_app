"use client";

import { Exam, QuestionPart7, TopicPart7 } from "@prisma/client";
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

interface AddPart7FormProps {
  exam?: Exam & {
    part7s: QuestionPart7[];
  };
  part7?: QuestionPart7;
  handleDialogueOpen: (part: PartType) => void;
  topics: TopicPart7[];
}

const formSchema = z.object({
  imageFile: z.string().optional(), // cho phép trường này trống
  imageFile2: z.string().nullable(), // cho phép trường này trống
  imageFile3: z.string().nullable(), // cho phép trường này trống
  answer1: z.string().min(1, { message: "must be atleast 7 characters long." }),
  answer2: z.string().min(1, { message: "must be atleast 7 characters long." }),
  answer3: z.string().min(1, { message: "must be atleast 7 characters long." }),
  answer4: z.string().min(1, { message: "must be atleast 7 characters long." }),
  topicId: z.string().nullable(),
  correctAnswer: z
    .string()
    .min(1, { message: "must be atleast 7 characters long." }), // Đáp án đúng
  explainAnswer: z
    .string()
    .min(3, { message: "must be atleast 3 characters long." }),
});

const AnswerPart7 = ({ exam, part7, handleDialogueOpen }: AddPart7FormProps) => {
  const [image, setImage] = useState<string | undefined>(part7?.imageFile);

  const [image2, setImage2] = useState<string | undefined>(part7?.imageFile2 as string | undefined);


  const [image3, setImage3] = useState<string | undefined>(part7?.imageFile3 as string | undefined);


  const [imageIsDeleting, setImageIsDeleting] = useState(false);

  const [imageIsDeleting2, setImageIsDeleting2] = useState(false);

  const [imageIsDeleting3, setImageIsDeleting3] = useState(false);

  const [topics, setTopics] = useState<TopicPart7[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: part7 || {
      imageFile: "",
      answer1: "A",
      answer2: "B",
      answer3: "C",
      answer4: "D",
      correctAnswer: "", // Đáp án đúng
      explainAnswer: "",
      topicId: "",
      imageFile2: "",
      imageFile3:"",
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

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await apiClient.get(USER_API_ROUTES.GET_TOPICS_PART7);

        if (response.data.topics) {
          setTopics(response.data.topics); // Correctly set the topics array
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  

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

  const handleImageDelete2 = (image2: string) => {
    setImageIsDeleting2(true);
    const imageKey = image2.substring(image2.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage2("");
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
        setImageIsDeleting2(false);
      });
  };

  const handleImageDelete3 = (image3: string) => {
    setImageIsDeleting3(true);
    const imageKey = image3.substring(image3.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage3("");
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
        setImageIsDeleting3(false);
      });
  };


  const handleOpenDialogue = () => {
    // Assuming you want to open the dialogue for "part7"
    handleDialogueOpen("part7");
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (exam && part7) {
      axios
        .patch(`/api/part7/${part7.id}`, values)
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

        .post("/api/part7", { ...values, examId: exam.id })
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
                      <div className="relative max-w-[700px] min-w-[200px] max-h-[700px] min-h-[200px] mt-7">
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
                        className="flex flex-col items-center max-w-[7000px] p-12 border-2 border-dashed
                          border-primary/50 rounded mt-7"
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
            name="imageFile2"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>Upload an Image 2</FormLabel>
                <FormDescription>
                  Choose an image that will show-case your Exam nicely
                </FormDescription>
                <FormControl>
                  {image2 ? (
                    <>
                      <div className="relative max-w-[700px] min-w-[200px] max-h-[700px] min-h-[200px] mt-7">
                        <Image
                          fill
                          src={image2}
                          alt="Exam Image"
                          className="object-contain"
                        />
                        <Button
                          onClick={() => handleImageDelete2(image2)}
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="absolute right-[-12px] top-0"
                        >
                          {imageIsDeleting2 ? <Loader2 /> : <XCircle />}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="flex flex-col items-center max-w-[7000px] p-12 border-2 border-dashed
                          border-primary/50 rounded mt-7"
                      >
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            console.log("Files: ", res);
                            setImage2(res[0].url);
                            form.setValue("imageFile2",res[0].url)
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
            name="imageFile3"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>Upload an Image</FormLabel>
                <FormDescription>
                  Choose an image that will show-case your Exam nicely
                </FormDescription>
                <FormControl>
                  {image3 ? (
                    <>
                      <div className="relative max-w-[700px] min-w-[200px] max-h-[700px] min-h-[200px] mt-7">
                        <Image
                          fill
                          src={image3}
                          alt="Exam Image"
                          className="object-contain"
                        />
                        <Button
                          onClick={() => handleImageDelete3(image3)}
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="absolute right-[-12px] top-0"
                        >
                          {imageIsDeleting3 ? <Loader2 /> : <XCircle />}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="flex flex-col items-center max-w-[7000px] p-12 border-2 border-dashed
                          border-primary/50 rounded mt-7"
                      >
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            console.log("Files: ", res);
                            setImage3(res[0].url);
                            form.setValue("imageFile3",res[0].url)
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

export default AnswerPart7;
