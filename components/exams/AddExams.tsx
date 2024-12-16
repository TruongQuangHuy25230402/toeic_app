"use client";

import React, { useEffect, useState } from "react";

import * as z from "zod";

import {
  ExamQuestion,
  Exams, QuestionsT,
  User,
  User_Answer
} from "@prisma/client";

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
import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Separator } from "../ui/separator";
import { UploadButton } from "../uploadthing";
import AddQuestions from "../questions/AddQuestion";
import Arrayquestions from "../questions/ArrQues";
import UploadQues from "../upload/UploadQues";
import { QuestionsProps } from "@/actions/getQuestions";
import QuestionTable from "./QuestionTable";

interface Question {
  id: string;
  title: string;
  questionText: string;
  answer1:       string;
  answer2:       string;
  answer3:       string;
  answer4:       string;
  correctAnswer: string;      
  explainAnswer: string;
  part: string;
  // Add other fields you need here
}


interface AddExamsFormProps {
  exams: ExamsWith | null;
  question: QuestionsProps[];
};
export type ExamsWith = Exams & {
  questions: QuestionsT[];
  user_Answers?: User_Answer[];
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

const AddExams = ({ exams, question }: AddExamsFormProps) => {


  const [questions, setQuestions] = useState<Question[]>([]);

  const { examsId } = useParams<{ examsId: string }>();

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isexamsDeleting, setIsexamsDeleting] = useState(false);

  const [audio, setAudio] = useState<string | undefined>(exams?.audioFile);

  const [audioIsDeleting, setAudioIsDeleting] = useState(false);

  const [open, setOpen] = useState(false);

  const [selectedTab, setSelectedTab] = useState<"info" | "answers">("info");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Lấy `examId` từ URL (ví dụ, thông qua useParams)
 

  const handleOpenDialog = (question: Question) => {
    setSelectedQuestion(question);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedQuestion(null);
  };

  const { toast } = useToast();

  const router = useRouter();
  

  //Kiểm tra nếu mà không nhập dữ liệu mà submit form thì sẽ báo lỗi
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: exams || {
      title: "",
      description: "",
      audioFile: "",
    },
  });

  // Hàm submit form gửi dữ liệu lên db
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (exams) {
      axios
        .patch(`/api/exams/${exams.id}`, values)
        .then((res) => {
          toast({
            variant: "default",
            description: "exams Update!",
          });
          alert("Exam Update!")
          router.push(`/exams/${res.data.id}`);
          setIsLoading(false);
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
      axios
        .post("/api/exams", values)
        .then((res) => {
          toast({
            variant: "default",
            description: "exams created.",
          });
          alert("Exam Created!")
          router.push(`/exams/${res.data.id}`);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Some thing went wrong!",
          });
          alert("Some thing went wrong!")
          setIsLoading(false);
        });
    }
  }


  //Hàm xóa exams
  const handelDeleteexams = async (exams: ExamsWith) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa bài thi này không?");
    if (!isConfirmed) {
      // Nếu người dùng chọn "Hủy bỏ", dừng thực hiện hàm
      return;
    }

    
    setIsexamsDeleting(true);
    try {
      await axios.delete(`/api/exams/${exams.id}`);

      setIsexamsDeleting(false);
      alert("Exam Removed");
      router.push("/exams/new");
    } catch (error: any) {
      console.log(error);
      setIsexamsDeleting(false);
      alert("Something went wrong");
    }
  };

  // Ứng với từng part của exams thì sẽ có dialog để nhập dữ liệu riêng
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
    if (exams?.id) {
      const fetchExamQuestions = async () => {
        try {
          console.log("Fetching questions for exam ID:", exams.id);
          const response = await axios.get(`/api/examQuestion?examId=${exams.id}`);
          console.log("Response data:", response.data);
  
          const mappedQuestions = response.data.map((item: any) => item.ques);
          console.log("Mapped questions:", mappedQuestions);
          setQuestions(mappedQuestions);
        } catch (error) {
          console.error("Error fetching exam questions:", error);
        }
      };
  
      fetchExamQuestions();
    }
  }, [exams?.id]);
  

  const toggleDetails = (id: string) => {
    setExpandedQuestionId((prevId) => (prevId === id ? null : id));
  };

  const handleEdit = (id: string) => {
    router.push(`/ques/${id}`);
  }

  const handleDelete = async (quesId: string) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?");
    if (!isConfirmed) {
      return;
    }
  
    console.log("Sending delete request for examId:", examsId, "quesId:", quesId); // Debugging
  
    try {
      const response = await axios.delete(`/api/exams/${examsId}/${quesId}`);
      console.log("Deleted successfully:", response.data);
      alert("Câu hỏi đã được xóa thành công!");
  
      setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== quesId));
    } catch (error) {
      console.error("Error deleting exam question:", error);
      alert("Đã xảy ra lỗi khi xóa câu hỏi.");
    }
  };

  const handleAddHotel = () => {
    // Chuyển hướng đến trang "hotel/new"
    router.push("/examQuestion");
  };

  const handleBack = () => {
    router.push("/exams/new");
  };
  
  
  
  
  
  

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

  return (
    // Form để nhập dữ liệu
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">
            {exams ? "Update your exams!" : "Describe your exams!"}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            
            <div className="w-full md:w-[70%] flex flex-col gap-6">
              <div className="flex gap-4 mb-4">
                {exams && ( // Chỉ hiển thị nếu exams đã được tạo
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
                    <button
                      className={`py-2 px-4 rounded ${
                        selectedTab === "answers"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handleTabChange("answers")}
                    >
                      Thông tin câu hỏi
                    </button>
                  </>
                )}
              </div>
              {selectedTab === "info" &&(
                <>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>exams Title *</FormLabel>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Toeic exams" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>exams Description</FormLabel>
                        <FormDescription>
                          Provide a detailed description of your exams
                        </FormDescription>
                        <FormControl>
                          <Textarea placeholder="Description exams" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="audioFile"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-3">
                        <FormLabel>Upload an Audio File</FormLabel>
                        <FormDescription>
                          Choose an audio file that will complement your exams.
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

                  {exams && (
                    <Alert className="bg-indigo-600 text-white">
                      <Terminal className="h-4 w-4 stroke-white" />
                      <AlertTitle>One last step!</AlertTitle>
                      <AlertDescription>
                        Your exams was created successfully
                        <div>
                          Please add some rooms to complete our your exams setup!
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex justify-between gap-4 flex-wrap">
                  <div className="flex justify-end gap-4">
                        {exams && (
                          // Delete Button
                          <Button
                            onClick={() => handelDeleteexams(exams)}
                            variant="ghost"
                            type="button"
                            className="max-w-[150px]"
                            disabled={isexamsDeleting || isLoading}
                          >
                            {isexamsDeleting ? (
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

                        {exams ? (
                          // Update Button
                          <Button
                            className="max-w-[150px]"
                            disabled={isLoading}
                          >
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
                          // Create exams Button
                          <Button
                            className="max-w-[150px]"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4" />
                                Creating
                              </>
                            ) : (
                              <>
                                <Pencil className="mr-2 h-4 w-4" />
                                Create exams
                              </>
                            )}
                          </Button>
                        )}

                      </div>
                    <div>
                      
                    </div>
                  </div>

                  


                </>


              )}



              
            </div>

              {selectedTab === "info" &&(
                <>
                <div className="w-full md:w-[30%] flex flex-col gap-6">
              {exams && !!exams.questions.length && (
                <div>
                  <Separator />
                  <div className="flex justify-between gap-4 flex-wrap mt-2">
                  <div>

</div>
                  <div className="flex justify-between gap-4 flex-wrap mt-2">
                    {exams.questions.map((question, index) => (
                      <Arrayquestions
                        key={question.id}
                        exams={exams}
                        questions={question}
                        index={index}
                      />
                    ))}
                  </div>
                  </div>
                </div>
              )}




              
            </div>
                </>
              )}
            
          </div>
          {selectedTab === "answers" && (
  <div>
    {questions && questions.length > 0 ? (
      // Display QuestionTable if questions are available
      <QuestionTable
        questions={questions}
        onToggleDetails={toggleDetails}
        expandedQuestionId={expandedQuestionId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ) : (
      // Render UploadQues if no questions are available
      <div className="flex flex-col items-center space-y-4">
          <UploadQues questions={[]} />
      </div>
    )}
  </div>
)}
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
      <Button onClick={handleAddHotel}>Link Question</Button>
      </div>
    </div>
  );
};

export default AddExams;
