// File: pages/api/sections/[sectionId]/questions.ts


// Lấy danh sách câu hỏi cho phần luyện nghe
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sectionId } = req.query;

  if (req.method === 'GET') {
    try {
      const questions = await prisma.question.findMany({
        where: {
          sectionId: sectionId as string, // Chuyển đổi sectionId thành string
        },
      });
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching questions' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

