"use client";

import React from 'react';
import { ExamWithParts } from './AddToeicExamForm';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Clock, Users, List, QuoteIcon } from 'lucide-react';

const ExamCard = ({ exam }: { exam: ExamWithParts }) => {
  const pathname = usePathname();
  const isMyExams = pathname.includes("my-exams");
  const router = useRouter();

  return (
    <div
      onClick={() => !isMyExams && router.push(`/details/${exam.id}`)}
      className={cn(
        "cursor-pointer transition hover:scale-105 w-full max-w-[180px]", // Giới hạn chiều rộng tối đa
        isMyExams && "cursor-default"
      )}
    >
      <div className="flex flex-col gap-2 bg-background/50 border border-primary/10 rounded-lg p-4 w-full">
        {/* Tiêu đề */}
        <h3 className="font-semibold text-base">{exam.title}</h3>

        {/* Thời gian làm bài */}
        <div className="text-primary/90 text-sm flex items-center gap-2">
          <Clock size={20} /> 120 phút
        </div>

        {/* Số người đã làm */}
        <div className="text-primary/90 text-sm flex items-center gap-2">
          <Users size={20} />  người
        </div>

        {/* 7 phần thi */}
        <div className="text-primary/90 text-sm flex items-center gap-2">
          <List size={20} /> 7 phần
        </div>

        {/* 200 câu hỏi */}
        <div className="text-primary/90 text-sm flex items-center gap-2">
          <QuoteIcon size={20} /> 200 câu
        </div>

        {/* Nút chi tiết */}
        <button
          onClick={() => router.push(`/details/${exam.id}`)}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
