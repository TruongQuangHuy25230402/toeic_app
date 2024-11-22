import { Action } from "@/components/Action";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserButton, useAuth } from "@clerk/nextjs";
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ActionButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, userId, signOut } = useAuth(); // Lấy thông tin người dùng

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
                  {/* Chỉ hiển thị UserButton nếu đã đăng nhập */}
                  {isSignedIn && <UserButton afterSignOutUrl="/" />}
                  
                  {!isSignedIn && (
                    <>
                      <Button
                        onClick={() => router.push("/sign-in")}
                        variant="outline"
                        size="sm"
                      >
                        Sign in
                      </Button>

                      <Button
                        onClick={() => router.push("/sign-up")}
                        size="sm"
                      >
                        Sign up
                      </Button>
                    </>
                  )}
                  
                  {/* Các liên kết không yêu cầu xác thực */}
                  <Link href="/" className="link-class">Get started</Link>
                  <Link href="/list-exams" className="link-class">Đề thi online</Link>
                  <Link href="/list" className="link-class">Luyện thi</Link>
                  <Link href="/lms" className="link-class">Khóa học</Link>
                  <Link href="/contact" className="link-class">Liên hệ</Link>
                  
                  {/* Nút logout chỉ hiển thị nếu người dùng đã đăng nhập */}
                  {isSignedIn && (
                    <Link href="/" onClick={handleLogout}>
                      Log Out
                    </Link>
                  )}
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

        {/* Chỉ hiển thị UserButton nếu đã đăng nhập */}
        {isSignedIn && <UserButton afterSignOutUrl="/" />}
        
        {!isSignedIn && (
          <>
            <Button
              onClick={() => router.push("/sign-in")}
              variant="outline"
              size="sm"
            >
              Sign in
            </Button>

            <Button onClick={() => router.push("/sign-up")} size="sm">
              Sign up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionButton;
