"use client";
import React, { useState } from 'react';
import { UploadButton } from '../uploadthing';

const Part1: React.FC = () => {
  // State to store the uploaded file URLs
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-6">File Upload</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium">Upload Images</h2>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              const urls = res.map(file => file.url);
              setImageUrls(urls);
              console.log("Image Upload response: ", { message: "Image Upload Completed", fileUrls: urls });
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
          {/* Render uploaded image URLs */}
          {imageUrls.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium">Uploaded Image URLs:</h3>
              <ul className="list-disc list-inside">
                {imageUrls.map((url, index) => (
                  <li key={index}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

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
              <h3 className="font-medium">Uploaded Audio URLs:</h3>
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
  );
}

export default Part1;
