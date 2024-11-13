import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { examQuestionPairs } = await req.json();

    // Validate the input
    if (!examQuestionPairs || !Array.isArray(examQuestionPairs)) {
      return new NextResponse('Invalid data format', { status: 400 });
    }

    const results = await Promise.all(
      examQuestionPairs.map(async ({ examId, questionId }) => {
        if (!examId || !questionId) {
          throw new Error('Both examId and questionId are required');
        }

        // Check if the relationship already exists in the examQuestion table
        const existingRelation = await prisma.examQuestion.findUnique({
          where: {
            quesId_examId: {
              quesId: questionId,
              examId: examId,
            },
          },
        });

        // Only create the relationship if it doesn't already exist
        if (!existingRelation) {
          // Create new relationship
          const newRelation = await prisma.examQuestion.create({
            data: {
              quesId: questionId,
              examId,
            },
          });
          return { type: "created", data: newRelation };
        } else {
          // If it exists, return a message indicating the relationship already exists
          return { type: "exists", message: `Relationship for examId ${examId} and questionId ${questionId} already exists.` };
        }
      })
    );

    // Separate the newly created relations from existing ones
    const savedRelations = results.filter((result) => result.type === "created").map((result) => result.data);
    const existingRelations = results.filter((result) => result.type === "exists").map((result) => result.message);

    // Prepare a message based on the results
    const responseMessage = [
      savedRelations.length > 0 ? `${savedRelations.length} new relationships created successfully.` : null,
      existingRelations.length > 0 ? `${existingRelations.length} relationships already existed and were not created again.` : null
    ].filter(Boolean).join(" ");

    return NextResponse.json({
      message: responseMessage,
      savedRelations,
      existingRelations,
    });
  } catch (error) {
    console.error("Error saving relationships:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}





export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);  // Extract query parameters from the request URL
  const examId = searchParams.get("examId");   // Get the examId query parameter

  try {
    // If examId is provided, filter examQuestions by examId
    if (examId) {
      const examQuestions = await prisma.examQuestion.findMany({
        where: { examId },  // Filter by examId if provided
        include: {
          ques: true,  // Include question details for each exam question
        },
      });

      return NextResponse.json(examQuestions);  // Return filtered results
    } else {
      // If examId is not provided, fetch all examQuestions
      const allExamQuestions = await prisma.examQuestion.findMany({
        include: {
          exam: true,
          ques: true,  // Include question details for all exam questions
        },
      });

      return NextResponse.json(allExamQuestions);  // Return all exam questions
    }
  } catch (error) {
    console.error("Error fetching exam questions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });  // Handle errors
  }
}



