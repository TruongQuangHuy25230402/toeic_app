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
    const [filterRange, setFilterRange] = useState('30 ngày');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [filteredData, setFilteredData] = useState<User_Answer[]>([]);
    const convertTimeToSeconds = (time: string): number => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

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
    
    const calculateMetrics = (data: UserAnswer[]) => {
    const totalExams = data.length;

    // Tính tổng thời gian (chuyển từ giây sang phút)
    const totalTimeInSeconds = data.reduce((acc, item) => acc + convertTimeToSeconds(item.timeTaken || '00:00:00'), 0);
    const totalTimeInMinutes = Math.floor(totalTimeInSeconds / 60); // Chuyển sang phút

    const correctAnswers = data.reduce((acc, item) => acc + item.numberCorrect, 0);
    const totalQuestions = data.reduce((acc, item) => acc + item.numberCorrect + item.numberWrong + item.numberSkip, 0);
    const averageScore = data.reduce((acc, item) => acc + item.totalScore, 0) / totalExams || 0;
    const highestScore = Math.max(...data.map((item) => item.totalScore), 0);

    return {
        totalExams,
        totalTime: totalTimeInMinutes, // Tổng thời gian luyện thi (phút)
        accuracy: totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : '0.00',
        averageScore: averageScore.toFixed(2),
        highestScore,
    };
};


   const metrics = calculateMetrics(filteredData);

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

    const handleSearch = async () => {
        try {
            const params: any = { userId }; // Luôn gửi userId
    
            if (filterRange && filterRange !== 'all' && filterRange !== '') {
                params.range = filterRange; // Gửi khoảng thời gian
            }
    
            const response = await apiClient.get('/filter', { params });
    
            if (response.data && Array.isArray(response.data.filteredData)) {
                setFilteredData(response.data.filteredData); // Cập nhật dữ liệu đã lọc
            } else {
                setFilteredData([]); // Không có dữ liệu
            }
        } catch (error) {
            console.error('Error fetching filtered data:', error);
        }
    };

    console.log("Filtered Data:", filteredData);
    

    return (
        <div className="overflow-x-auto">
            <div>
            <div className="flex items-center mb-4">
            <select
    value={filterRange}
    onChange={(e) => setFilterRange(e.target.value)}
    className="border border-gray-300 rounded px-3 py-2"
>
    {timeOptions.map((option) => (
        <option key={option.value} value={option.value}>
            {option.label}
        </option>
    ))}
</select>

    <button
        onClick={handleSearch}
        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
        Search
    </button>
</div>


<div className="grid grid-cols-4 gap-4">
    <div className="border border-gray-300 rounded-lg p-4 text-center">
        <h3 className="text-lg font-bold">Số đề đã làm</h3>
        <p className="text-2xl">{metrics.totalExams}</p>
        <p>đề thi</p>
    </div>
    <div className="border border-gray-300 rounded-lg p-4 text-center">
        <h3 className="text-lg font-bold">Thời gian luyện thi</h3>
        <p className="text-2xl">{metrics.totalTime}</p>
        <p>phút</p>
    </div>
    <div className="border border-gray-300 rounded-lg p-4 text-center">
        <h3 className="text-lg font-bold">Độ chính xác</h3>
        <p className="text-2xl">{metrics.accuracy}%</p>
    </div>
    <div className="border border-gray-300 rounded-lg p-4 text-center">
        <h3 className="text-lg font-bold">Điểm trung bình</h3>
        <p className="text-2xl">{metrics.averageScore}/495</p>
    </div>
    <div className="border border-gray-300 rounded-lg p-4 text-center">
        <h3 className="text-lg font-bold">Điểm cao nhất</h3>
        <p className="text-2xl">{metrics.highestScore}/495</p>
    </div>
</div>

            </div>
            <h2 className="text-lg font-bold mb-4">Tổng hợp các đề thi thật của người dùng
            
    
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
                            <th className="border border-gray-300 px-4 py-2">Thời gian</th>
                           
                            <th className="border border-gray-300 px-4 py-2">Ngày Tạo</th>
                            <th className="border border-gray-300 px-4 py-2">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.length > 0 ? (
                            details.map((userAnswer) => (
                                <tr key={userAnswer.id}>
                                    <td className="border text-center border-gray-300 px-4 py-2">{userAnswer.exams?.title || 'Không có tiêu đề'}</td>
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
