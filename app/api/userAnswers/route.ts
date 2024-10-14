import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, UserAnswer } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userAnswers } = req.body; // Nhận mảng các câu trả lời từ request

      // Kiểm tra xem tất cả các userAnswers đã có đầy đủ dữ liệu chưa
      const formattedAnswers = userAnswers.map((answer: Partial<UserAnswer>) => {
        if (!answer.userId) {
          throw new Error("Missing userId");
        }
        return {
          userId: answer.userId, // Bắt buộc phải có
          selectedAnswer: answer.selectedAnswer || "", // Đảm bảo không undefined
          isCorrect: answer.isCorrect || false, // Đảm bảo không undefined
          isSkipped: answer.isSkipped || false, // Đảm bảo không undefined
          questionPart1Id: answer.part1sId || null,
          questionPart2Id: answer.part2sId || null,
          questionPart3Id: answer.part3sId || null,
          questionPart4Id: answer.part4sId || null,
          questionPart5Id: answer.part5sId || null,
          questionPart6Id: answer.part6sId || null,
          questionPart7Id: answer.part7sId || null,
        };
      });

      // Sử dụng createMany để lưu nhiều câu trả lời một lúc
      const savedAnswers = await prisma.userAnswer.createMany({
        data: formattedAnswers,
      });

      return res.status(201).json({
        message: 'User answers saved successfully',
        savedAnswers,
      });
    } catch (error) {
      console.error('Error saving user answers:', error);
      return res.status(500).json({ error: 'Failed to save user answers' });
    }
  } else {
    // Nếu không phải là phương thức POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
