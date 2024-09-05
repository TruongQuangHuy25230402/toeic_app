import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
    const { userId } = auth();

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const { imageKey, audioKey } = await req.json();

    try {
        let res;
        if (imageKey) {
            res = await utapi.deleteFiles(imageKey);
        } else if (audioKey) {
            res = await utapi.deleteFiles(audioKey);
        } else {
            return new NextResponse("Bad Request", { status: 400 });
        }

        return NextResponse.json(res);
    } catch (error) {
        console.log("error at uploadthing/delete:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
