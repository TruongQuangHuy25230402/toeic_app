"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { USER_API_ROUTES } from "@/ultis/api-route";
import { Separator } from "../ui/separator";

type User_Answer = {
    id: string;
    userId: string;
    examId: string | null;
    scoreListening: number;
    scoreReading: number;
    totalScore: number;
    numberCorrect: number;
    numberWrong: number;
    numberSkip: number;
    timeTaken: string;
    createdAt: Date;
    updatedAt: Date;
    exams?: {
        title: string;
    } | null;
};

type UserAnswer = {
    id: string;
    userId: string;
    examId: string | null;
    scoreListening: number;
    scoreReading: number;
    totalScore: number;
    numberCorrect: number;
    numberWrong: number;
    numberSkip: number;
    timeTaken: string;
    createdAt: Date;
    updatedAt: Date;
    exam?: {
        title: string;
    } | null;
};

interface DetailUserAnswersProps {
    userId: string; // Receive userId as a prop
}

const DetailAnswer = ({ userId }: DetailUserAnswersProps) => {
    const [details, setDetails] = useState<User_Answer[]>([]);
    const [loading, setLoading] = useState(true);
    const [detailss, setDetailss] = useState<UserAnswer[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Modify the API call to include the userId
                const response = await apiClient.get(`${USER_API_ROUTES.GET_USER_ANSWERs}?userId=${userId}`);
                console.log("API Response:", response.data);
                
                if (Array.isArray(response.data.details)) {
                    setDetails(response.data.details);
                }
            } catch (error) {
                console.error("Error fetching user answers:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchDetails();
        }
    }, [userId]);

    useEffect(() => {
        const fetchDetailss = async () => {
            try {
                // Modify the API call to include the userId
                const response = await apiClient.get(`${USER_API_ROUTES.GET_USER_ANSWER}?userId=${userId}`);
                console.log("API Response:", response.data);
                
                if (Array.isArray(response.data.detailss)) {
                    setDetailss(response.data.detailss);
                }
            } catch (error) {
                console.error("Error fetching user answers:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchDetailss();
        }
    }, [userId]);

    return (
        <div className="overflow-x-auto">
            <h2 className="text-lg font-bold mb-4">Tổng hợp các đề thi thật của người dùng</h2>
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">Exam Title</th>
                            <th className="border border-gray-300 px-4 py-2">Điểm Nghe</th>
                            <th className="border border-gray-300 px-4 py-2">Điểm Đọc</th>
                            <th className="border border-gray-300 px-4 py-2">Tổng Điểm</th>
                            <th className="border border-gray-300 px-4 py-2">Thời gian</th>
                           
                            <th className="border border-gray-300 px-4 py-2">Ngày Tạo</th>
                            <th className="border border-gray-300 px-4 py-2">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.length > 0 ? (
                            details.map((userAnswer) => (
                                <tr key={userAnswer.id}>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.exams?.title || 'Không có tiêu đề'}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.scoreListening}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.scoreReading}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.totalScore}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.timeTaken || 'trống'}</td>
                                    
                                    <td className="border border-gray-300 px-4 py-2">
    {new Date(userAnswer.createdAt).toLocaleDateString('en-GB')} || {new Date(userAnswer.createdAt).toLocaleTimeString()}
</td>
                                    <td className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => router.push(`/userAnswerT/${userAnswer.id}`)}>Chi tiết</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="border border-gray-300 px-4 py-2 text-center">
                                    Không có dữ liệu câu trả lời nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
<Separator className="mt-10"/>
<h2 className="text-lg font-bold mb-4">Tổng hợp các luyện thi ngẫu nhiên của người dùng</h2>
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">Exam Title</th>
                            <th className="border border-gray-300 px-4 py-2">Full Test</th>
                            <th className="border border-gray-300 px-4 py-2">Điểm Nghe</th>
                            <th className="border border-gray-300 px-4 py-2">Điểm Đọc</th>
                            <th className="border border-gray-300 px-4 py-2">Tổng Điểm</th>
                            <th className="border border-gray-300 px-4 py-2">Thời gian</th>
                            
                            <th className="border border-gray-300 px-4 py-2">Ngày Tạo</th>
                            <th className="border border-gray-300 px-4 py-2">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailss.length > 0 ? (
                            detailss.map((userAnswer) => (
                                <tr key={userAnswer.id}>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.exam?.title || 'Không có tiêu đề'}</td>
                                    <td className="border text-center border-gray-300 px-4 py-2">
  {userAnswer.numberCorrect + userAnswer.numberWrong + userAnswer.numberSkip === 200 ? (
    <span className="text-green-500"><i className="fas fa-check text-green-500">x</i></span>
  ) : (
    ""
  )}
</td> <td className="border border-gray-300 px-4 py-2">{userAnswer.scoreListening}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.scoreReading}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.totalScore}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.timeTaken || 'trống'}</td>
                                    
                                    
                                    <td className="border border-gray-300 px-4 py-2">
    {new Date(userAnswer.createdAt).toLocaleDateString('en-GB')} || {new Date(userAnswer.createdAt).toLocaleTimeString()}
</td>
                                    <td className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => router.push(`/userAnswer/${userAnswer.id}`)}>Chi tiết</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="border border-gray-300 px-4 py-2 text-center">
                                    Không có dữ liệu câu trả lời nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DetailAnswer;
