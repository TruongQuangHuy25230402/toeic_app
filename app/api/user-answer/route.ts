// File: pages/api/user-answers.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, questionId, selectedOption, isCorrect } = req.body;

    try {
      const userAnswer = await prisma.userAnswer.create({
        data: {
          userId,
          questionId,
          selectedOption,
          isCorrect,
        },
      });
      res.status(201).json(userAnswer);
    } catch (error) {
      res.status(500).json({ error: 'Error saving user answer' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
