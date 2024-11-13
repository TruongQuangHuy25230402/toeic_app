"use client";

import React, { useEffect, useState } from "react";

import * as z from "zod";
import Image from "next/image";
import { Exams, Ques, User_Answer } from "@prisma/client";

import { useToast } from "../ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Eye,
  Loader2,
  Pencil,
  PencilLine,
  Plus,
  Terminal,
  Trash,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { UploadButton } from "../uploadthing";
import dynamic from "next/dynamic";
import apiClient from "@/lib/api-client";
import { USER_API_ROUTES } from "@/ultis/api-route";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Question {
  id: string;
  title: string;
  questionText: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: string;
  explainAnswer: string;
  // Add other fields you need here
}

interface AddquesFormProps {
  ques: QuesWith | null;
}

export type QuesWith = Ques & {
  user_Answers?: User_Answer[];
};

const formSchema = z.object({
  questionText: z.string().optional(),
  title: z.string().optional(),
  audioFile: z.string().optional(),
  imageFile2: z.string().nullable(), // cho phép trường này trống
  imageFile3: z.string().nullable(), // cho phép trường này trống
  imageFile: z.string().optional(), // cho phép trường này bỏ trống
  answer1: z.string().min(1, { message: "must be atleast 1 characters long." }),
  answer2: z.string().min(1, { message: "must be atleast 1 characters long." }),
  answer3: z.string().min(1, { message: "must be atleast 1 characters long." }),
  answer4: z.string().optional(), // cho phép trường này bỏ trống
  groupId: z.string().nullable(), // cho phép trường này trống
  correctAnswer: z
    .string()
    .min(1, { message: "must be atleast 1 characters long." }), // Đáp án đúng
  explainAnswer: z
    .string()
    .min(3, { message: "must be atleast 3 characters long." }),
  part: z.enum([
    "questionPart1",
    "questionPart2",
    "questionPart3",
    "questionPart4",
    "questionPart5",
    "questionPart6",
    "questionPart7",
  ]), // Thêm trường 'part' với các giá trị trong enum QuestionPart
});

const AddQues = ({ ques }: AddquesFormProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isquesDeleting, setIsquesDeleting] = useState(false);

  const [image, setImage] = useState<string | undefined>(ques?.imageFile);

  const [image2, setImage2] = useState<string | undefined>(
    ques?.imageFile2 as string | undefined
  );

  const [exams, setExams] = useState<Exams[]>([]);

  const [image3, setImage3] = useState<string | undefined>(
    ques?.imageFile3 as string | undefined
  );

  const [imageIsDeleting, setImageIsDeleting] = useState(false);

  const [audio, setAudio] = useState<string | undefined>(ques?.audioFile);

  const [imageIsDeleting2, setImageIsDeleting2] = useState(false);

  const [imageIsDeleting3, setImageIsDeleting3] = useState(false);

  const [audioIsDeleting, setAudioIsDeleting] = useState(false);

  const [selectedPart, setSelectedPart] = useState<string>("questionPart1");

  const [open, setOpen] = useState(false);

  const [selectedTab, setSelectedTab] = useState<"info" | "answers">("info");

  const { toast } = useToast();

  const router = useRouter();

  const { watch } = useForm(); // Destructure `watch` her

  //Kiểm tra nếu mà không nhập dữ liệu mà submit form thì sẽ báo lỗi
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: ques || {
      title: "",
      questionText: "",
      audioFile: "",
      imageFile: "",
      answer1: "A",
      answer2: "B",
      answer3: "C",
      answer4: "D",
      correctAnswer: "", // Đáp án đúng
      explainAnswer: "",
      imageFile2: "",
      imageFile3: "",
      groupId: "",
      part: "questionPart1", // Giá trị mặc định cho phần câu hỏi
    },
  });

  useEffect(() => {
    console.log("Part Selected:", selectedPart);
  }, [selectedPart]); // This will log each time selectedPart changes

  // Ứng với từng part của ques thì sẽ có dialog để nhập dữ liệu riêng
  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

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
    const fetchExams = async () => {
      try {
        const response = await apiClient.get(USER_API_ROUTES.GET_EXAMS);

        console.log("Fetched Exams Data:", response.data); // Log the entire response data

        if (response.data.exams) {
          setExams(response.data.exams); // Correctly set the exams array
          console.log("Exams Array:", response.data.exams); // Log the exams array
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/ques`);
        console.log("Response data:", response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Listen for changes to the `part` field and update `selectedPart`
  useEffect(() => {
    const subscription = form.watch((value) => {
      // If part is undefined, set a default value
      setSelectedPart(value.part || "questionPart1");
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleAudioDelete = (audio: string) => {
    setAudioIsDeleting(true);
    const audioKey = audio.substring(audio.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { audioKey })
      .then((res) => {
        if (res.data.success) {
          setAudio("");
          alert("Audio Removed");
        }
      })
      .catch(() => {
        alert("Something went wrong");
      })
      .finally(() => {
        setAudioIsDeleting(false);
      });
  };

  const handleTabChange = (tab: "info" | "answers") => {
    setSelectedTab(tab);
  };

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
        alert("Something went wrong");
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

  const handelDeleteExam = async (ques: QuesWith) => {
    setIsquesDeleting(true);
    try {
      await axios.delete(`/api/ques/${ques.id}`);

      setIsquesDeleting(false);
      toast({
        variant: "default",
        description: "Ques Delete!",
      });
      router.push("/ques/new");
    } catch (error: any) {
      console.log(error);
      setIsquesDeleting(false);
      alert("Something went wrong");
    }
  };

  const handleAddHotel = () => {
    // Chuyển hướng đến trang "hotel/new"
    router.push("/examQuestion");
  };

  const handleBack = () => {
    router.push("/ques/new");
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (ques) {
      // Nếu câu hỏi đã tồn tại, thực hiện PATCH
      axios
        .patch(`/api/ques/${ques.id}`, values)
        .then((res) => {
          alert("Question Updated");
          router.push(`/ques/${res.data.id}`);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.status === 400) {
            const message = err.response.data.message; // Lấy thông báo lỗi
            const questionId = err.response.data.questionId; // Lấy id câu hỏi trùng
            alert(`${message} (ID: ${questionId})`); // Hiển thị thông báo kèm ID
          } else {
            alert("Something went wrong");
          }
          setIsLoading(false);
        });
    } else {
      // Nếu là câu hỏi mới, thực hiện POST
      axios
        .post("/api/ques", values)
        .then((res) => {
          alert("Question Created");
          router.push(`/ques/${res.data.id}`);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.status === 400) {
            const message = err.response.data.message; // Message from the backend
            const questionId = err.response.data.questionId; // ID of the duplicate question
            alert(`${message}`); // Show message with duplicate question ID
          } else {
            alert("Something went wrong");
          }
          setIsLoading(false);
        });
    }
  }
  return (
    // Form để nhập dữ liệu
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">
            {ques ? "Update your ques!" : "Describe your ques!"}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-[70%] flex flex-col gap-6">
              <div className="flex gap-4 mb-4">
                <>
                  <button
                    className={`py-2 px-4 rounded ${
                      selectedTab === "info"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleTabChange("info")}
                  >
                    Thông tin đề thi
                  </button>
                </>
              </div>
              {selectedTab === "info" && (
                <>
                  <FormField
                    control={form.control}
                    name="part"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-3">
                        <FormLabel>Question Part</FormLabel>
                        <FormDescription>
                          Choose the part to which this question belongs.
                        </FormDescription>
                        <FormControl>
                          <select {...field} className="border p-2 rounded">
                            <option value="questionPart1">Part 1</option>
                            <option value="questionPart2">Part 2</option>
                            <option value="questionPart3">Part 3</option>
                            <option value="questionPart4">Part 4</option>
                            <option value="questionPart5">Part 5</option>
                            <option value="questionPart6">Part 6</option>
                            <option value="questionPart7">Part 7</option>
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>

                        <FormControl>
                          <Input placeholder="Title Question" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(selectedPart === "questionPart3" ||
                    selectedPart === "questionPart4" ||
                    selectedPart === "questionPart5" ||
                    selectedPart === "questionPart7") && (
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
                  )}

                  {(selectedPart === "questionPart1" ||
                    selectedPart === "questionPart3" ||
                    selectedPart === "questionPart6" ||
                    selectedPart === "questionPart4" ||
                    selectedPart === "questionPart7") && (
                    <FormField
                      control={form.control}
                      name="imageFile"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3">
                          <FormLabel>Upload an Image</FormLabel>
                          <FormDescription>
                            Choose an image that will show-case your exams
                            nicely
                          </FormDescription>
                          <FormControl>
                            {image ? (
                              <>
                                <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                                  <Image
                                    fill
                                    src={image}
                                    alt="exams Image"
                                    className="object-contain"
                                  />
                                  <Button
                                    onClick={() => handleImageDelete(image)}
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-[-12px] top-0"
                                  >
                                    {imageIsDeleting ? (
                                      <Loader2 />
                                    ) : (
                                      <XCircle />
                                    )}
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
                  )}

                  {(selectedPart === "questionPart1" ||
                    selectedPart === "questionPart2" ||
                    selectedPart === "questionPart3" ||
                    selectedPart === "questionPart4") && (
                    <FormField
                      control={form.control}
                      name="audioFile"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3">
                          <FormLabel>Upload an Audio File</FormLabel>
                          <FormDescription>
                            Choose an audio file that will complement your ques.
                          </FormDescription>
                          <FormControl>
                            {audio ? (
                              <>
                                <div className="relative max-w-[400px] min-w-[200px] mt-4">
                                  <audio controls>
                                    <source src={audio} type="audio/mpeg" />
                                    Your browser does not support the audio
                                    element.
                                  </audio>
                                  <Button
                                    onClick={() => handleAudioDelete(audio)}
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-[-12px] top-[-12px]"
                                  >
                                    {audioIsDeleting ? (
                                      <Loader2 />
                                    ) : (
                                      <XCircle />
                                    )}
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
                                      alert("Upload complete");
                                    }}
                                    onUploadError={(error: Error) => {
                                      alert("Something went wrong");
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
                  )}

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

                  {(selectedPart === "questionPart1" ||
                    selectedPart === "questionPart3" ||
                    selectedPart === "questionPart6" ||
                    selectedPart === "questionPart4" ||
                    selectedPart === "questionPart5" ||
                    selectedPart === "questionPart7") && (
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
                  )}

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

                  {(selectedPart === "questionPart3" ||
                    selectedPart === "questionPart6" ||
                    selectedPart === "questionPart4" ||
                    selectedPart === "questionPart7") && (
                    <FormField
                      control={form.control}
                      name="groupId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group Id</FormLabel>

                          <FormControl>
                            <Input
                              placeholder="GroupId"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="explainAnswer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Explain Answer</FormLabel>

                        <FormControl>
                          <Textarea placeholder="correctAnswer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(selectedPart === "questionPart6" ||
                    selectedPart === "questionPart7") && (
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
                                    {imageIsDeleting2 ? (
                                      <Loader2 />
                                    ) : (
                                      <XCircle />
                                    )}
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
                                      form.setValue("imageFile2", res[0].url);
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
                  )}

                  {(selectedPart === "questionPart6" ||
                    selectedPart === "questionPart7") && (
                    <FormField
                      control={form.control}
                      name="imageFile3"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3">
                          <FormLabel>Upload an Image 3</FormLabel>
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
                                    {imageIsDeleting3 ? (
                                      <Loader2 />
                                    ) : (
                                      <XCircle />
                                    )}
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
                                      form.setValue("imageFile3", res[0].url);
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
                  )}

                  <div className="flex justify-between gap-4 flex-wrap">
                    <div className="flex justify-end gap-4">
                      {ques ? (
                        // Update Button
                        <Button className="max-w-[150px]" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4" />
                              Updating
                            </>
                          ) : (
                            <>
                              <PencilLine className="mr-2 h-4 w-4" />
                              Update
                            </>
                          )}
                        </Button>
                      ) : (
                        // Create ques Button
                        <Button className="max-w-[150px]" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4" />
                              Creating
                            </>
                          ) : (
                            <>
                              <Pencil className="mr-2 h-4 w-4" />
                              Create ques
                            </>
                          )}
                        </Button>
                      )}

                      {ques && (
                        // Delete Button
                        <Button
                          onClick={() => handelDeleteExam(ques)}
                          variant="ghost"
                          type="button"
                          className="max-w-[150px]"
                          disabled={isquesDeleting || isLoading}
                        >
                          {isquesDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4" />
                              Deleting
                            </>
                          ) : (
                            <>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </>
                          )}
                        </Button>
                      )}

                      
                       
   
                     
                    </div>
                    <div></div>
                  </div>
                </>
              )}
            </div>
          </div>
          {selectedTab === "answers" && <div></div>}
        </form>
      </Form>
      <div className=" mt-10 flex justify-start gap-4">
        <Button
        onClick={handleBack}
        variant="ghost"
        className="text-gray-500 hover:text-gray-700 border border-gray-500 rounded-md"
      >
        Back
      </Button>
      <Button onClick={handleAddHotel}>Link Exam</Button>
      </div>
      
    </div>
  );
};

export default AddQues;
