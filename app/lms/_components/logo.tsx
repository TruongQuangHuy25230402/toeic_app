import Image from "next/image"
import Link from "next/link";
import { MdQuiz } from "react-icons/md";

export const Logo = ()=>{
    return (
        <div>
          <Link
            href={"/"}
            className="flex gap-1 items-center text-2xl"
          >
            <h1 className="text-dark font-bold">
              CodeQuiz
            </h1>
            <MdQuiz className="text-primary" />
          </Link>
        </div>
    )
}