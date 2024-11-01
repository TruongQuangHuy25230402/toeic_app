"use client";
import { createBulkPart7s, deletePart7s, Part7Props } from "@/actions/getPart7";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { usePathname, useRouter } from "next/navigation"; // Import necessary hooks
import { QuestionPart7 } from "@prisma/client";
import axios from "axios";

const Part7 = ({ part7s }: { part7s: Part7Props[] }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const router = useRouter();
  const pathname = usePathname(); // Lấy pathname
  const examId = pathname.split("/")[2]; // Lấy phần thứ hai của đường dẫn
  const [arrPart7, setArrPart7] = useState<QuestionPart7[]>([]);

  // Function to preview the data
  function previewData() {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet);
          setJsonData(JSON.stringify(json, null, 2));
        }
      };
      reader.readAsBinaryString(file);
    }
  }

  console.log(file);
  // Function to save the data
  async function saveData() {
    if (file && examId) {
      // Ensure examId exists in the URL
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json: Part7Props[] = XLSX.utils.sheet_to_json(workSheet);

          // Add examId to each question if it's missing in the Excel file
          const dataWithExamId = json.map((item) => ({
            ...item,
            examId: item.examId || examId, // Assign examId from the URL
          }));

          try {
            await createBulkPart7s(dataWithExamId);
            setLoading(false);
            // Reload the current page instead of redirecting
            window.location.reload();
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        }
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Please select a file before uploading.");
    }
  }

  async function clearData() {
    try {
      await deletePart7s(examId);
      // Reload the current page after clearing data
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Gửi yêu cầu đến API với examId
        const response = await axios.get(`/api/part7?examId=${examId}`);
        setArrPart7(response.data.arr); // Cập nhật state với danh sách câu hỏi
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [examId]); // Khi examId thay đổi, useEffect sẽ chạy lại

  return (
    <div className="py-8 space-y-8">
      {/* Kiểm tra xem đã có câu hỏi hay chưa */}
      {arrPart7.length > 0 ? (
        
        // Nếu đã có câu hỏi, hiển thị bảng câu hỏi
        <div className="relative overflow-x-auto">
          <div>
            <button
              onClick={clearData}
              className="py-2 px-6 rounded bg-red-600 text-slate-100"
            >
              Clear Data
            </button>
          </div>
          
          <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-70 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Question
                </th>
                <th scope="col" className="px-6 py-3">
                  Answer 1
                </th>
                <th scope="col" className="px-6 py-3">
                  Answer 2
                </th>
                <th scope="col" className="px-6 py-3">
                  Answer 3
                </th>
                <th scope="col" className="px-6 py-3">
                  Answer 4
                </th>
                <th scope="col" className="px-6 py-3">
                  Correct
                </th>
                <th scope="col" className="px-6 py-3">
                  Explanation
                </th>
              </tr>
            </thead>
            <tbody>
              {arrPart7.map((part7) => (
                <tr
                  key={part7.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div
                      className="truncate max-w-xs"
                      title={part7.questionText}
                    >
                      {part7.questionText}
                    </div>
                  </td>
                  <td className="px-6 py-4">{part7.answer1}</td>
                  <td className="px-6 py-4">{part7.answer2}</td>
                  <td className="px-6 py-4">{part7.answer3}</td>
                  <td className="px-6 py-4">{part7.answer4}</td>
                  <td className="px-6 py-4">{part7.correctAnswer}</td>
                  <td className="px-6 py-4">
                    <div
                      className="truncate max-w-xs"
                      title={part7.explainAnswer}
                    >
                      {part7.explainAnswer}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Nếu chưa có câu hỏi, hiển thị phần upload file
        <div>
          <div className="flex items-center gap-8">
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="file_input"
              >
                Upload file
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-70 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="file_input"
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
            <button
              onClick={previewData}
              className="py-2 px-6 rounded bg-slate-300 text-slate-900"
            >
              Preview Data
            </button>
            <button
              onClick={saveData}
              className="py-2 px-6 rounded bg-purple-600 text-slate-100"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Data"}
            </button>
            
          </div>
          <pre>{jsonData}</pre>
        </div>
      )}
    </div>
  );
};

export default Part7;
