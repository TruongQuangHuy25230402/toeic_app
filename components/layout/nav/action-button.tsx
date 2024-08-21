import { Action } from "@/components/Action";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserButton, useAuth } from "@clerk/nextjs";

import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ActionButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <AlignJustify />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>
                <div className="flex flex-col space-y-4 items-start w-full text-lg text black mt-10">
                  <UserButton afterSignOutUrl="/" />
                  {!userId && (
                    <>
                      <Button
                        onClick={() => router.push("/sign-in")}
                        variant="outline"
                        size="sm"
                      >
                        Sign in
                      </Button>

                      <Button onClick={() => router.push("/sign-up")} size="sm">
                        Sign up{" "}
                      </Button>
                    </>
                  )}
                   <Link
    href="/"
    className="hover:border-4 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300 p-2 rounded-lg"
  >Get started</Link>
                  <Link
    href="/"
    className="hover:border-4 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300 p-2 rounded-lg"
  >Chương trình học</Link>
                  <Link
    href="/"
    className="hover:border-4 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300 p-2 rounded-lg"
  >Đề thi online</Link>
                  <Link
    href="/"
    className="hover:border-4 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300 p-2 rounded-lg"
  >Flashcards</Link>
                  <Link
    href="/"
    className="hover:border-4 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300 p-2 rounded-lg"
  >Khóa học</Link>
                  <Link
    href="/"
    className="hover:border-4 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300 p-2 rounded-lg"
  >Blog</Link>
                  <Link
    href="/"
    className="hover:border-4 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300 p-2 rounded-lg"
  >Hỗ trợ</Link>
                  <Link
    href="/"
    className="hover:border-4 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300 p-2 rounded-lg"
  >Liên hệ</Link>
                  <Link
    href="/"
    className="hover:border-4 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300 p-2 rounded-lg"
  >Thông tin</Link>
                  <Link href="/" onClick={handleLogout}>
                    Log Out
                  </Link>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:flex md:space-x-4">
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Action />
        </div>
        <UserButton afterSignOutUrl="/" />
        {!userId && (
          <>
            <Button
              onClick={() => router.push("/sign-in")}
              variant="outline"
              size="sm"
            >
              Sign in
            </Button>

            <Button onClick={() => router.push("/sign-up")} size="sm">
              Sign up{" "}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionButton;
