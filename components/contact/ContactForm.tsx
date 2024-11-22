"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

// Schema xác thực
export const formSchema = z.object({
  fullname: z.string().min(3, "Fullname must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm() {
  const [error, setError] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // Sử dụng react-hook-form với schema
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const { msg, success } = await res.json();
      setError(msg || []);
      setSuccess(success);

      if (success) {
        reset(); // Reset form nếu gửi thành công
        alert("Gửi thành công")
      }
    } catch (err) {
      setError(["An unexpected error occurred."]);
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Fullname */}
        <div className="mb-4">
          <Input
            {...register("fullname")}
            type="text"
            placeholder="Your Name"
            className="w-full"
          />
          {errors.fullname && (
            <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <Input
            {...register("email")}
            type="email"
            placeholder="Your Email"
            className="w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="mb-4">
          <Textarea
            {...register("message")}
            placeholder="Type your message here..."
            className="w-full"
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-12 text-white text-base font-semibold rounded-full ${
            isSubmitting ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-800"
          }`}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>

      {/* Error/Success Messages */}
      <div className="mt-4">
        {error.length > 0 &&
          error.map((err, idx) => (
            <p key={idx} className="text-red-600 text-sm">
              {err}
            </p>
          ))}
        {success && (
          <p className="text-green-600 text-sm">Message sent successfully!</p>
        )}
      </div>
    </div>
  );
}
