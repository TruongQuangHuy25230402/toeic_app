'use client'

import { Exam, QuestionPart6 } from '@prisma/client'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";

type PartType = "part1" | "part2" | "part3" | "part4" | "part5" | "part6" | "part7";

interface AddPart6FormProps{
    exam?: Exam & {
        part6s: QuestionPart6[]
    }
    part6?: QuestionPart6
    handleDialogueOpen: (part: PartType) => void;
}

const formSchema = z.object({
  questionText   : z.string().min(3,{message: 'must be atleast 3 characters long.'}),
  audioFile      : z.string().min(1,{message: 'Audio is required'}),   
  imageFile      : z.string().min(1,{message: 'Image is required'}),   
  answer1        : z.string().min(3,{message: 'must be atleast 3 characters long.'}),
  answer2        : z.string().min(3,{message: 'must be atleast 3 characters long.'}),
  answer3        : z.string().min(3,{message: 'must be atleast 3 characters long.'}),
  answer4        : z.string().min(3,{message: 'must be atleast 3 characters long.'}),
  correctAnswer  : z.string().min(3,{message: 'must be atleast 3 characters long.'}),      // Đáp án đúng
  explainAnswer  : z.string().min(3,{message: 'must be atleast 3 characters long.'}),
})


const AddPart6 = ({exam, part6, handleDialogueOpen}: AddPart6FormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: part6 || {
            questionText  : "",
            audioFile     : "",   
            imageFile     : "",   
            answer1       : "",
            answer2       : "",
            answer3       : "",
            answer4       : "",
            correctAnswer : "",      // Đáp án đúng
            explainAnswer : "",
        },
    });
  return (
    <div>
      Add part 6
    </div>
  )
}

export default AddPart6;
