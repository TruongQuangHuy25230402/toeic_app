"use client";

import React, { useState } from "react";

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
import BulkUpload from "./bulk-upload";
import { getPart1s } from "@/app/api/part1/route";


interface AddExamFormProps {
  exam: ExamWithParts | null;
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
});

const AddToeicExamForm = ({ exam }: AddExamFormProps) => {

  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isExamDeleting, setIsExamDeleting] = useState(false);

  const [jsonData, setJsonData] = useState("");

  console.log(file);

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

  const { toast } = useToast();

  const router = useRouter();

  //Kiểm tra nếu mà không nhập dữ liệu mà submit form thì sẽ báo lỗi
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: exam || {
      title: "",
      description: "",
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

  return (
    // Form để nhập dữ liệu
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">
            {exam ? "Update your Exam!" : "Describe your exam!"}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
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
                {exam && (
                  //Delete
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

                {exam && (
                  //View
                  <Button
                  onClick={() => router.push('/bulk-upload')}
                    type="button"
                    variant="outline"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Uploads
                  </Button>
                )}

<Button
                  onClick={() => router.push('')}
                    type="button"
                    variant="outline"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    
                  </Button>
                 

                {exam ? (
                  //Update
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
                  <>
                    <Button className="max-w-[150px]" disabled={isLoading}>
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
                  </>
                )}

                <Separator />

                <div className="flex justify-between gap-4 flex-wrap">
                  {exam && (
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
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            Add details about a room in your exam
                          </DialogDescription>
                        </DialogHeader>
                        <AddPart1
                          exam={exam}
                          handleDialogueOpen={handleDialogOpen}
                        />
                      </DialogContent>
                    </Dialog>
                  )}

                  {exam && (
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
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            Add details about a room in your exam
                          </DialogDescription>
                        </DialogHeader>
                        <AddPart2
                          exam={exam}
                          handleDialogueOpen={handleDialogOpen}
                        />
                      </DialogContent>
                    </Dialog>
                  )}

                  {exam && (
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
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            Add details about a room in your exam
                          </DialogDescription>
                        </DialogHeader>
                        <AddPart3
                          exam={exam}
                          handleDialogueOpen={handleDialogOpen}
                        />
                      </DialogContent>
                    </Dialog>
                  )}

                  {exam && (
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
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            Add details about a room in your exam
                          </DialogDescription>
                        </DialogHeader>
                        <AddPart4
                          exam={exam}
                          handleDialogueOpen={handleDialogOpen}
                        />
                      </DialogContent>
                    </Dialog>
                  )}

                  {exam && (
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
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            Add details about a room in your exam
                          </DialogDescription>
                        </DialogHeader>
                        <AddPart5
                          exam={exam}
                          handleDialogueOpen={handleDialogOpen}
                        />
                      </DialogContent>
                    </Dialog>
                  )}

                  {exam && (
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
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
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

                  {exam && (
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
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
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
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-6">
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
                      />
                    ))}
                  </div>
                </div>
              )}
            <BulkUpload/>
            
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddToeicExamForm;
