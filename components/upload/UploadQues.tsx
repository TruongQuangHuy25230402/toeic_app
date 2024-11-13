"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { usePathname, useRouter } from "next/navigation"; // Import necessary hooks
import { QuestionsT } from "@prisma/client";
import axios from "axios";
import { UploadButton } from "../uploadthing";
import { createBulkQuestionss, deleteQuestionss, QuestionsProps } from "@/actions/getQuestions";

const UploadQues = ({ questions }: { questions: QuestionsProps[] }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [isExcelUpload, setIsExcelUpload] = useState(true);
  const [jsonData, setJsonData] = useState("");
  const router = useRouter();
  const pathname = usePathname(); // Lấy pathname
  const examsId = pathname.split("/")[2]; // Lấy phần thứ hai của đường dẫn
  const [arrQuestions, setArrQuestions] = useState<QuestionsT[]>([]);

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
    if (file && examsId) {
      // Ensure examsId exists in the URL
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json: QuestionsProps[] = XLSX.utils.sheet_to_json(workSheet);

          // Add examsId to each question if it's missing in the Excel file
          const dataWithexamsId = json.map((item) => ({
            ...item,
            examsId: item.examsId || examsId, // Assign examsId from the URL
          }));

          try {
            await createBulkQuestionss(dataWithexamsId);
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
        await deleteQuestionss(examsId);
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
        // Gửi yêu cầu đến API với examsId
        const response = await axios.get(`/api/questions?examsId=${examsId}`);
        setArrQuestions(response.data.arr); // Cập nhật state với danh sách câu hỏi
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [examsId]); // Khi examsId thay đổi, useEffect sẽ chạy lại

  const toggleUploadType = () => {
    setIsExcelUpload((prev) => !prev); // Chuyển trạng thái giữa hai phần
  };

  return (
    <div className="py-8 space-y-8">
      {/* Nút chuyển đổi giữa Upload Excel và Upload Image/Audio */}
      {arrQuestions.length === 0 && (
        <div className="text-center">
          <button
            onClick={toggleUploadType}
            className="py-2 px-6 rounded bg-blue-600 text-slate-100"
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
          {arrQuestions.length > 0 ? (
            <div className="relative overflow-x-auto">
              <div>
                <button
                  onClick={clearData}
                  className="py-2 px-6 rounded bg-red-600 text-slate-100"
                >
                  Clear Data
                </button>
              </div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-200">
                <thead className="text-xs text-gray-800 uppercase bg-gray-200 dark:bg-gray-700">
                  <tr>
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
                  {arrQuestions.map((Questions) => (
                    <tr
                      key={Questions.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {Questions.answer1}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {Questions.answer2}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {Questions.answer3}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {Questions.answer4}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {Questions.correctAnswer}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="truncate max-w-xs"
                          title={Questions.explainAnswer}
                        >
                          {Questions.explainAnswer}
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
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-10 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
      ) : (
        // Phần upload Image/Audio
        <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-center mb-6">
            File Upload
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload Section */}
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-medium">Upload Images</h2>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  const urls = res.map((file) => file.url);
                  setImageUrls(urls);
                  console.log("Image Upload response: ", {
                    message: "Image Upload Completed",
                    fileUrls: urls,
                  });
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
              {imageUrls.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium">Uploaded Image URLs:</h3>
                  <ul className="list-disc list-inside">
                    {imageUrls.map((url, index) => (
                      <li key={index}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Audio Upload Section */}
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-medium">Upload Audio Files</h2>
              <UploadButton
                endpoint="audioUploader"
                onClientUploadComplete={(res) => {
                  const urls = res.map((file) => file.url);
                  setAudioUrls(urls);
                  console.log("Audio Upload response: ", {
                    message: "Audio Upload Completed",
                    fileUrls: urls,
                  });
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
              {audioUrls.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium">Uploaded Audio URLs:</h3>
                  <ul className="list-disc list-inside">
                    {audioUrls.map((url, index) => (
                      <li key={index}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {url}
                        </a>
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

export default UploadQues;
