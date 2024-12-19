"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { USER_API_ROUTES } from "@/ultis/api-route";

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
    createdAt: Date;
    updatedAt: Date;
    exam?: {
        title: string;
    } | null;
};

interface DetailUserAnswerProps {
    userId: string; // Receive userId as a prop
}

const DetailUserAnswer = ({ userId }: DetailUserAnswerProps) => {
    const [details, setDetails] = useState<UserAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    const [filterRange, setFilterRange] = useState('30 ngày');
    const timeOptions = [
        { label: '-- Chọn khoảng thời gian --', value: '' },
        { label: 'Tất cả', value: 'all' },
        { label: '3 ngày gần nhất', value: 3 },
        { label: '7 ngày gần nhất', value: 7 },
        { label: '30 ngày', value: 30 },
        { label: '60 ngày', value: 60 },
        { label: '90 ngày', value: 90 },
        { label: '6 tháng', value: 180 },
        { label: '1 năm', value: 365 },
    ];
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFilterRange(value);
    
        if (value === 'all' || value === '') {
            setStartDate(null); // Không áp dụng bộ lọc ngày
        } else {
            const days = parseInt(value, 10);
            const newStartDate = new Date();
            newStartDate.setDate(newStartDate.getDate() - days);
            setStartDate(newStartDate);
        }
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Modify the API call to include the userId
                const response = await apiClient.get(`${USER_API_ROUTES.GET_USER_ANSWER}?userId=${userId}`);
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

    return (
        <div className="overflow-x-auto">
            <div className="flex items-center mb-4">
    
</div>
            <h2 className="text-lg font-bold mb-4">Tổng hợp các đề thi của người dùng
            <select
        value={filterRange}
        onChange={handleFilterChange}
        className="border border-gray-300 rounded px-3 py-2"
    >
        {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
    <button
        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
        Search
    </button>
            </h2>
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
                            <th className="border border-gray-300 px-4 py-2">Số Đúng</th>
                            <th className="border border-gray-300 px-4 py-2">Số Sai</th>
                            <th className="border border-gray-300 px-4 py-2">Số Bỏ Qua</th>
                            <th className="border border-gray-300 px-4 py-2">Ngày Tạo</th>
                            <th className="border border-gray-300 px-4 py-2">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.length > 0 ? (
                            details.map((userAnswer) => (
                                <tr key={userAnswer.id}>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.exam?.title || 'Không có tiêu đề'}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.scoreListening}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.scoreReading}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.totalScore}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.numberCorrect}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.numberWrong}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userAnswer.numberSkip}</td>
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

export default DetailUserAnswer;
