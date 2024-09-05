import { QuestionPart1 } from "@prisma/client";
import React, { useState } from "react";
import * as XLSX from "xlsx";

const BulkUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");
  console.log(file);

  function previewData() {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          // SheetName
          const sheetName = workbook.SheetNames[0];
          // Worksheet
          const workSheet = workbook.Sheets[sheetName];
          // Json
          const json = XLSX.utils.sheet_to_json(workSheet);
          setJsonData(JSON.stringify(json, null, 2));
        }
      };
      reader.readAsBinaryString(file);

    }
  }


  return (
    <div className="py-8 space-y-8">
      {/* BUTTONS */}
      {/* upload input, preview btn , save btn , clear Data */}
      <div className="flex items-center gap-8">
        <div className="">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            accept=".xls,.xlsx"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <button
          onClick={previewData}
          className="py-2 px-6 rounded bg-slate-300 text-slate-900 "
        >
          Preview Data
        </button>
        <button
          //onClick={saveData}
          className="py-2 px-6 rounded bg-purple-600 text-slate-100 "
        >
          Save Data
        </button>
        <button
          //onClick={clearData}
          className="py-2 px-6 rounded bg-red-600 text-slate-100 "
        >
          Clear Data
        </button>
      </div>
      <pre>{jsonData}</pre>
      {loading ? (
        <p>Saving Data please wait...</p>
      ) : (
        <div className="relative overflow-x-auto">
          
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3">
                    City
                  </th>
                </tr>
              </thead>
              <tbody>
                
                 
                    <tr
                    
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Huy
                      </th>
                      <td className="px-6 py-4">12</td>
                      <td className="px-6 py-4">HCM</td>
                    </tr>
                  
                
              </tbody>
            </table>
          
        </div>
      )}

      {/* Table */}

      
    </div>
  );
};

export default BulkUpload;
