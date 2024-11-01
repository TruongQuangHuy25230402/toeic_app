"use client";
import { createBulkPart4s, deletePart4s, Part4Props } from "@/actions/getPart4";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { usePathname, useRouter } from "next/navigation"; // Import necessary hooks
import { QuestionPart4 } from "@prisma/client";
import axios from "axios";
import { UploadButton } from "../uploadthing";

const Part4 = ({ part4s }: { part4s: Part4Props[] }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [isExcelUpload, setIsExcelUpload] = useState(true);
  const [jsonData, setJsonData] = useState("");
  const router = useRouter();
  const pathname = usePathname(); // Lấy pathname
  const examId = pathname.split("/")[2]; // Lấy phần thứ hai của đường dẫn
  const [arrPart4, setArrPart4] = useState<QuestionPart4[]>([]);

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
          const json: Part4Props[] = XLSX.utils.sheet_to_json(workSheet);

          // Add examId to each question if it's missing in the Excel file
          const dataWithExamId = json.map((item) => ({
            ...item,
            examId: item.examId || examId, // Assign examId from the URL
          }));

          try {
            await createBulkPart4s(dataWithExamId);
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
    const confirmClear = window.confirm(
      "Are you sure you want to clear all data?"
    );
    if (confirmClear) {
      try {
        await deletePart4s(examId);
        // Reload the current page after clearing data
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Gửi yêu cầu đến API với examId
        const response = await axios.get(`/api/part4?examId=${examId}`);
        setArrPart4(response.data.arr); // Cập nhật state với danh sách câu hỏi
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [examId]); // Khi examId thay đổi, useEffect sẽ chạy lại

  const toggleUploadType = () => {
    setIsExcelUpload((prev) => !prev); // Chuyển trạng thái giữa hai phần
  };

  return (
    <div className="py-8 space-y-8">
      {/* Nút chuyển đổi giữa Upload Excel và Upload Image/Audio */}
      {arrPart4.length === 0 && (
        <div className="text-center">
          <button
            onClick={toggleUploadType}
            className="py-2 px-6 rounded bg-blue-600 text-slate-400"
          >
            {isExcelUpload
              ? "Switch to Image/Audio Upload"
              : "Switch to Excel Upload"}
          </button>
        </div>
      )}

      {/* Hiển thị phần upload dựa trên trạng thái */}
      {isExcelUpload ? (
        // Phần upload Excel
        <div>
          {arrPart4.length > 0 ? (
            <div className="relative overflow-x-auto">
              <div>
                <button
                  onClick={clearData}
                  className="py-2 px-6 rounded bg-red-600 text-slate-400"
                >
                  Clear Data
                </button>
              </div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-200">
                <thead className="text-xs text-gray-800 uppercase bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Answer 1
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Answer 2
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Answer 3
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Answer 4
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Correct
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Explanation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {arrPart4.map((part4) => (
                    <tr
                      key={part4.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {part4.answer1}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {part4.answer2}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {part4.answer3}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {part4.answer4}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {part4.correctAnswer}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="truncate max-w-xs"
                          title={part4.explainAnswer}
                        >
                          {part4.explainAnswer}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-8">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Upload Excel File
                  </label>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-400 rounded-lg cursor-pointer bg-gray-40 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
                  className="py-2 px-6 rounded bg-slate-400 text-slate-900"
                >
                  Preview Data
                </button>
                <button
                  onClick={saveData}
                  className="py-2 px-6 rounded bg-purple-600 text-slate-400"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Data"}
                </button>
              </div>
              <pre>{jsonData}</pre>
            </div>
          )}
        </div>
      ) : (
        // Phần upload Image/Audio
        <div className="max-w-4xl mx-auto p-4 bg-gray-200 rounded-lg shadow-md">
      <div className="gap-6">
      
        {/* Audio Upload Section */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium">Upload Audio</h2>
          <UploadButton
            endpoint="audioUploader"
            onClientUploadComplete={(res) => {
              const urls = res.map(file => file.url);
              setAudioUrls(urls);
              console.log("Audio Upload response: ", { message: "Audio Upload Completed", fileUrls: urls });
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
          {/* Render uploaded audio URLs */}
          {audioUrls.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Uploaded Audio URLs:</h4>
              <ul className="list-disc list-inside">
                {audioUrls.map((url, index) => (
                  <li key={index}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
      )}
    </div>
  );
};

export default Part4;
