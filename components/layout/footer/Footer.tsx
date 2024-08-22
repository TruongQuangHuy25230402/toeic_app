"use client";
import Container from "@/components/Container";
import FooterList from "./FooterList";
import Link from "next/link";
import { MdFacebook } from "react-icons/md";
import {
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillYoutube,
} from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isDashboardPage = pathname === "/admin/dashboard";
  const isLoginPage = pathname === "/admin/login";
  const isTripsPage = pathname === "/admin/trips";
  const isHotelsPage = pathname === "/admin/hotel";
  const isBookingsPage = pathname === "/admin/booking";

  // Nếu đang ở trang admin/dashboard, không hiển thị NavBar
  if (
    isLoginPage ||
    isDashboardPage ||
    isBookingsPage ||
    isTripsPage ||
    isHotelsPage
  ) {
    return null;
  }
  return (
    <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
          <FooterList>
            <h3 className="text-base font-bold mb-2">Chương trình học</h3>

            <Link href="#">IELTS</Link>
            <Link href="#">TOEIC</Link>

          </FooterList>

          <FooterList>
            <h3 className="text-base font-bold mb-2">Tài nguyên</h3>

            <Link href="#">Thư viện đề thi</Link>
            <Link href="#">Blog</Link>
            <Link href="#">Kho tài liệu</Link>
            <Link href="#">Nhóm học tập</Link>
          </FooterList>

          <FooterList>
            <h3 className="text-base font-bold mb-2">Hỗ trợ</h3>

            <Link href="#">Hướng dẫn sử dụng</Link>
            <Link href="#">Hướng dẫn mua hàng</Link>
            <Link href="#">Chăm sóc khách hàng</Link>
            <Link href="#">Phản hồi khiếu nại</Link>
          </FooterList>
<FooterList>
            <h3 className="text-base font-bold mb-2">Theo dõi tại đây</h3>
            <div className="flex gap-2">
              <Link href="#">
                <MdFacebook size={24} />
              </Link>

              <Link href="#">
                <AiFillTwitterCircle size={24} />
              </Link>

              <Link href="#">
                <AiFillInstagram size={24} />
              </Link>

              <Link href="#">
                <AiFillYoutube size={24} />
              </Link>
            </div>
          </FooterList>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-base font-bold mb-2">Thông tin</h3>
            <p className="mb-2">
            Chào mừng bạn đến với Trung Tâm Luyện Thi TOEIC của chúng tôi, nơi bạn có thể chuẩn bị tốt nhất cho kỳ thi TOEIC!

Tại đây, chúng tôi cam kết hỗ trợ học viên trên toàn thế giới nâng cao kỹ năng tiếng Anh và đạt điểm cao trong kỳ thi TOEIC. Với nhiều năm kinh nghiệm trong việc giảng dạy và phát triển các khóa học TOEIC chất lượng, chúng tôi tự hào là một trong những địa chỉ uy tín giúp bạn chinh phục mục tiêu của mình.
            </p>
            <p>
              &copy; {new Date().getFullYear()} PalmTree. All rights reserved
            </p>
          </div>

          
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
