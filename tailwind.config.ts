import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

export default withUt({
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#E0E0E0",
        input: "#F2F2F2",
        ring: "#D4D4D4",
        background: "#F9F9F9",
        foreground: "#333333",  // Đổi màu chữ thành đậm để dễ đọc hơn
        primary: {
          DEFAULT: "#1E40AF", // Màu xanh dương đậm, phù hợp với chủ đề học tập
          foreground: "#FFFFFF", // Màu chữ trắng nổi bật trên nền xanh
        },
        secondary: {
          DEFAULT: "#0284C7", // Màu xanh đậm hơn
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#DC2626", // Đỏ tươi cho các nút cảnh báo hoặc hành động nguy hiểm
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#D1D5DB", // Màu xám nhạt cho các yếu tố ít quan trọng
          foreground: "#4B5563", // Màu chữ tối cho các yếu tố không quá nổi bật
        },
        accent: {
          DEFAULT: "#F59E0B", // Màu cam tươi cho các nút và yếu tố cần chú ý
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2937", // Màu chữ đen cho popover để dễ đọc
        },
        card: {
          DEFAULT: "#FFFFFF", // Nền trắng cho các thẻ
          foreground: "#111827", // Màu chữ đen cho thẻ
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-debug-screens")],
}) satisfies Config;