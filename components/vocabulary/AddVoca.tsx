"use client";

import { User, Vocabulary } from "@prisma/client";
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
import { Loader2, Pencil, PencilLine, Trash, XCircle } from "lucide-react";
import { UploadButton } from "../uploadthing";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css"; // Import stylesheet
import dynamic from "next/dynamic";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import apiClient from "@/lib/api-client";
import { USER_API_ROUTES } from "@/ultis/api-route";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });


type PartType =
  | "vocabulary"
  | "grammars"
 

interface AddVocabularyFormProps {
  user?: User & {
    vocabularies: Vocabulary[];
  };
  vocabulary?: Vocabulary;
  handleDialogueOpen: (part: PartType) => void;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

const AddVocabulary = ({ user, vocabulary, handleDialogueOpen }: AddVocabularyFormProps) => {


  const [isLoading, setIsLoading] = useState(false);

  const [records, setRecords] = useState<Vocabulary[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: vocabulary || {
      title:"",
      content:""
    },
  });

  const fetchRecords = async () => {
    try {
        const response = await axios.get('/api/vocabulary');
        setRecords(response.data);
    } catch (error) {
        console.error('Error fetching records:', error);
    }
};



const handleOpenDialogue = async () => {
  await fetchRecords();
  handleDialogueOpen("vocabulary"); // Mở dialog
};

  const handleQuestionDelete = (vocabulary: Vocabulary) => {
    setIsLoading(true);
    axios
        .delete(`/api/Vocabulary/${vocabulary.id}`)
        .then(() => {
            router.refresh();
            toast({
                variant: "default",
                description: "Question Deleted!",
            });
        })
        .catch(() => {
            toast({
                variant: "destructive",
                description: "Something went wrong!",
            });
        })
        .finally(() => {
            setIsLoading(false); // Ensure loading state is reset regardless of success or error
        });
};


  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (user && vocabulary) {
      axios
        .patch(`/api/vocabulary/${vocabulary.id}`, values)
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
      if (!user) return;
      axios

        .post("/api/vocabulary", { ...values, userId: user.id })
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề</FormLabel>

                <FormControl>
                  <Input placeholder="Tiêu đề" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          /> 
          
        <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>

                <FormControl>
                  <ReactQuill
                    placeholder="Nội dung!"
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

          


          <Separator />
          <div className="pt-4 pb-2 flex gap-2">
            {vocabulary ? (
              <>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  type="button"
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
                <Button
                  onClick={() => handleQuestionDelete(vocabulary)}
                  type="button"
                  className="max-w-[150px] bg-red-500 hover:bg-red-600"
                  disabled={isLoading}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                
              </>
            ) : (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                type="button"
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
                    Create Record
                  </>
                )}
              
              </Button>
              


            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddVocabulary;
