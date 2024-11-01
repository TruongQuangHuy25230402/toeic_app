import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { isTeacher } from '@/lib/teacher';

const f = createUploadthing();

const handleAuth = () => {
  const {userId} = auth()
  const isAuthorized = isTeacher(userId)
  if(!userId || !isAuthorized) throw new Error("Unauthorized")
  return {userId}
}

export const ourFileRouter = {
  // Uploader for images
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      const { userId } = auth();

      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),

  // Uploader for audio files
  audioUploader: f({ audio: { maxFileSize: "64MB", maxFileCount: 40 } })
    .middleware(async ({ req }) => {
      const { userId } = auth();

      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Audio upload complete for userId:", metadata.userId);
      console.log("audio file url", file.url);
      return { uploadedBy: metadata.userId };
    }),

    courseImage: f({image: {maxFileSize:"4MB", maxFileCount: 1}})
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{}),
  courseAttachment: f(["text",  "image", "video", "audio", "pdf"])
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{}),
  chapterVideo: f({video: {maxFileCount:1, maxFileSize:"512GB"}})
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
