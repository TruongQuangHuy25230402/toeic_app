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
import { useRouter } from "next/navigation";
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
import AddPart1 from "../part1/AddPart1";
import AddPart2 from "../part2/AddPart2";
import AddPart3 from "../part3/AddPart3";
import AddPart4 from "../part4/AddPart4";
import AddPart5 from "../part5/AddPart5";
import AddPart6 from "../part6/AddPart6";
import AddPart7 from "../part7/AddPart7";
import ArrayPart1 from "../part1/ArrayPart1";
import ArrayPart2 from "../part2/ArrayPart2";
import ArrayPart3 from "../part3/ArrayPart3";
import ArrayPart4 from "../part4/ArrayPart4";
import ArrayPart5 from "../part5/ArrayPart5";
import ArrayPart6 from "../part6/ArrayPart6";
import ArrayPart7 from "../part7/ArrayPart7";
import { UploadButton } from "../uploadthing";
import UploadFile from "../upload/UploadFile";
import { Part5Props } from "@/actions/getPart5";
import Part1 from "../upload/Part1";


interface AddExamFormProps {
  exam: ExamWithParts | null;
  part5: Part5Props[];
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

const AddToeicExamForm = ({ exam, part5 }: AddExamFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [isExamDeleting, setIsExamDeleting] = useState(false);

  const [audio, setAudio] = useState<string | undefined>(exam?.audioFile);

  const [audioIsDeleting, setAudioIsDeleting] = useState(false);

  const [topics, setTopics] = useState<TopicPart1[]>([]);

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

  const [selectedTab, setSelectedTab] = useState<"info" | "answers">("info");

  const { toast } = useToast();

  const router = useRouter();

  //Kiểm tra nếu mà không nhập dữ liệu mà submit form thì sẽ báo lỗi
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: exam || {
      title: "",
      description: "",
      audioFile: "",
    },
  });

  //Hàm submit form gửi dữ liệu lên db
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    //update
    if (exam) {
      axios
        .patch(`/api/exam/${exam.id}`, values)
        .then((res) => {
          toast({
            variant: "default",
            description: "Exam Update!",
          });
          router.push(`/exam/${res.data.id}`);
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
      //post dữ liệu lên db
      axios
        .post("/api/exam", values)
        .then((res) => {
          toast({
            variant: "default",
            description: "Exam created!",
          });
          router.push(`/exam/${res.data.id}`);
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
    }
  }

  //Hàm xóa Exam
  const handelDeleteExam = async (exam: ExamWithParts) => {
    setIsExamDeleting(true);
    try {
      await axios.delete(`/api/exam/${exam.id}`);

      setIsExamDeleting(false);
      toast({
        variant: "default",
        description: "Exam Delete!",
      });
      router.push("/exam/new");
    } catch (error: any) {
      console.log(error);
      setIsExamDeleting(false);
      toast({
        variant: "destructive",
        description: `Exam Deletion could not be completed! ${error.message}`,
      });
    }
  };

  // Ứng với từng part của exam thì sẽ có dialog để nhập dữ liệu riêng
  const handleDialogOpen = (part: PartType) => {
    setOpenDialog((prev) => (prev === part ? null : part));
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
            description: "Audio removed",
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

  const handleTabChange = (tab: "info" | "answers") => {
    setSelectedTab(tab);
  };

  return (
    // Form để nhập dữ liệu
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">
            {exam ? "Update your Exam!" : "Describe your exam!"}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            
            <div className="w-full md:w-[70%] flex flex-col gap-6">
              <div className="flex gap-4 mb-4">
                {exam && ( // Chỉ hiển thị nếu exam đã được tạo
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
                      Upload File
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
                        <FormLabel>Exam Title *</FormLabel>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Toeic Exam" {...field} />
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
                        <FormLabel>Exam Description</FormLabel>
                        <FormDescription>
                          Provide a detailed description of your exam
                        </FormDescription>
                        <FormControl>
                          <Textarea placeholder="Description Exam" {...field} />
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
                          Choose an audio file that will complement your Exam.
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

                  {exam && (
                    <Alert className="bg-indigo-600 text-white">
                      <Terminal className="h-4 w-4 stroke-white" />
                      <AlertTitle>One last step!</AlertTitle>
                      <AlertDescription>
                        Your exam was created successfully
                        <div>
                          Please add some rooms to complete our your exam setup!
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex justify-between gap-4 flex-wrap">
                  <div className="flex justify-end gap-4">
                        {exam && (
                          // Delete Button
                          <Button
                            onClick={() => handelDeleteExam(exam)}
                            variant="ghost"
                            type="button"
                            className="max-w-[150px]"
                            disabled={isExamDeleting || isLoading}
                          >
                            {isExamDeleting ? (
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

                        {exam ? (
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
                          // Create Exam Button
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
                                Create Exam
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <Separator/>
                    <div className="flex justify-between gap-4 flex-wrap">
                      {exam && exam.part1s.length < 6 && (
                        <Dialog
                          open={openDialog === "part1"}
                          onOpenChange={() => handleDialogOpen("part1")}
                        >
                          <DialogTrigger>
                            <Button
                              type="button"
                              variant="outline"
                              className="max-w-[150px]"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Part 1
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[900px] w-[90%]">
                            <DialogHeader className="px-2">
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                Add details about a room in your exam
                              </DialogDescription>
                            </DialogHeader>
                            <AddPart1
                              exam={exam}
                              handleDialogueOpen={handleDialogOpen}
                              topics={topics}
                            />
                          </DialogContent>
                        </Dialog>
                      )}

                      {exam && exam.part2s.length < 25 && (
                        <Dialog
                          open={openDialog === "part2"}
                          onOpenChange={() => handleDialogOpen("part2")}
                        >
                          <DialogTrigger>
                            <Button
                              type="button"
                              variant="outline"
                              className="max-w-[150px]"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Part 2
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[900px] w-[90%]">
                            <DialogHeader className="px-2">
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                Add details about a room in your exam
                              </DialogDescription>
                            </DialogHeader>
                            <AddPart2
                              exam={exam}
                              handleDialogueOpen={handleDialogOpen}
                              topics={topics}
                            />
                          </DialogContent>
                        </Dialog>
                      )}

                      {exam && exam.part3s.length < 39 && (
                        <Dialog
                          open={openDialog === "part3"}
                          onOpenChange={() => handleDialogOpen("part3")}
                        >
                          <DialogTrigger>
                            <Button
                              type="button"
                              variant="outline"
                              className="max-w-[150px]"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Part 3
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[900px] w-[90%]">
                            <DialogHeader className="px-2">
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                Add details about a room in your exam
                              </DialogDescription>
                            </DialogHeader>
                            <AddPart3
                              exam={exam}
                              handleDialogueOpen={handleDialogOpen}
                              topics={topics}
                            />
                          </DialogContent>
                        </Dialog>
                      )}

                      {exam && exam.part4s.length < 30 && (
                        <Dialog
                          open={openDialog === "part4"}
                          onOpenChange={() => handleDialogOpen("part4")}
                        >
                          <DialogTrigger>
                            <Button
                              type="button"
                              variant="outline"
                              className="max-w-[150px]"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Part 4
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[900px] w-[90%]">
                            <DialogHeader className="px-2">
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                Add details about a room in your exam
                              </DialogDescription>
                            </DialogHeader>
                            <AddPart4
                              exam={exam}
                              handleDialogueOpen={handleDialogOpen}
                              topics={topics}
                            />
                          </DialogContent>
                        </Dialog>
                      )}

                      {exam && exam.part5s.length < 30 && (
                        <Dialog
                          open={openDialog === "part5"}
                          onOpenChange={() => handleDialogOpen("part5")}
                        >
                          <DialogTrigger>
                            <Button
                              type="button"
                              variant="outline"
                              className="max-w-[150px]"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Part 5
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[900px] w-[90%]">
                            <DialogHeader className="px-2">
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                Add details about a room in your exam
                              </DialogDescription>
                            </DialogHeader>
                            <AddPart5
                              exam={exam}
                              handleDialogueOpen={handleDialogOpen}
                              topics={topics}
                            />
                          </DialogContent>
                        </Dialog>
                      )}

                      {exam && exam.part6s.length < 16 && (
                        <Dialog
                          open={openDialog === "part6"}
                          onOpenChange={() => handleDialogOpen("part6")}
                        >
                          <DialogTrigger>
                            <Button
                              type="button"
                              variant="outline"
                              className="max-w-[150px]"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Part 6
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[900px] w-[90%]">
                            <DialogHeader className="px-2">
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                Add details about a room in your exam
                              </DialogDescription>
                            </DialogHeader>
                            <AddPart6
                              exam={exam}
                              handleDialogueOpen={handleDialogOpen}
                            />
                          </DialogContent>
                        </Dialog>
                      )}

                      {exam && exam.part7s.length < 54 && (
                        <Dialog
                          open={openDialog === "part7"}
                          onOpenChange={() => handleDialogOpen("part7")}
                        >
                          <DialogTrigger>
                            <Button
                              type="button"
                              variant="outline"
                              className="max-w-[150px]"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Part 7
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[900px] w-[90%]">
                            <DialogHeader className="px-2">
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                Add details about a room in your exam
                              </DialogDescription>
                            </DialogHeader>
                            <AddPart7
                              exam={exam}
                              handleDialogueOpen={handleDialogOpen}
                            />
                          </DialogContent>
                        </Dialog>
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
              {exam && !!exam.part1s.length && (
                <div>
                  <h3>Part 1</h3>
                  <Separator />
                  <div className="flex justify-between gap-4 flex-wrap mt-2">
                    {exam.part1s.map((part1, index) => (
                      <ArrayPart1
                        key={part1.id}
                        exam={exam}
                        part1={part1}
                        index={index} // Truyền index đúng cách
                        topics={topics}
                      />
                    ))}
                  </div>
                </div>
              )}

              {exam && !!exam.part2s.length && (
                <div>
                  <h3>Part 2</h3>
                  <Separator />
                  <div className="flex justify-between gap-4 flex-wrap mt-2">
                    {exam.part2s.map((part2, index) => (
                      <ArrayPart2
                        key={part2.id}
                        exam={exam}
                        part2={part2}
                        index={index} // Truyền index đúng cách
                        topics={topics}
                      />
                    ))}
                  </div>
                </div>
              )}

              {exam && !!exam.part3s.length && (
                <div>
                  <h3>Part 3</h3>
                  <Separator />
                  <div className="flex justify-between gap-4 flex-wrap mt-2">
                    {exam.part3s.map((part3, index) => (
                      <ArrayPart3
                        key={part3.id}
                        exam={exam}
                        part3={part3}
                        index={index} // Truyền index đúng cách
                        topics={topics}
                      />
                    ))}
                  </div>
                </div>
              )}

              {exam && !!exam.part4s.length && (
                <div>
                  <h3>Part 4</h3>
                  <Separator />
                  <div className="flex justify-between gap-4 flex-wrap mt-2">
                    {exam.part4s.map((part4, index) => (
                      <ArrayPart4
                        key={part4.id}
                        exam={exam}
                        part4={part4}
                        index={index} // Truyền index đúng cách
                        topics={topics}
                      />
                    ))}
                  </div>
                </div>
              )}

              {exam && !!exam.part5s.length && (
                <div>
                  <h3>Part 5</h3>
                  <Separator />
                  <div className="flex justify-between gap-4 flex-wrap mt-2">
                    {exam.part5s.map((part5, index) => (
                      <ArrayPart5
                        key={part5.id}
                        exam={exam}
                        part5={part5}
                        index={index} // Truyền index đúng cách
                        topics={topics}
                      />
                    ))}
                  </div>
                </div>
              )}

              {exam && !!exam.part6s.length && (
                <div>
                  <h3>Part 6</h3>
                  <Separator />
                  <div className="flex justify-between gap-4 flex-wrap mt-2">
                    {exam.part6s.map((part6, index) => (
                      <ArrayPart6
                        key={part6.id}
                        exam={exam}
                        part6={part6}
                        index={index} // Truyền index đúng cách
                      />
                    ))}
                  </div>
                </div>
              )}

              {exam && !!exam.part7s.length && (
                <div>
                  <h3>Part 7</h3>
                  <Separator />
                  <div className="flex justify-between gap-4 flex-wrap mt-2">
                    {exam.part7s.map((part7, index) => (
                      <ArrayPart7
                        key={part7.id}
                        exam={exam}
                        part7={part7}
                        index={index} // Truyền index đúng cách
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
                </>
              )}
            
          </div>
          {selectedTab === "answers" && (
                <div>
                  <UploadFile part5ss={part5} />
                </div>
              )}
        </form>
      </Form>
    </div>
  );
};

export default AddToeicExamForm;
