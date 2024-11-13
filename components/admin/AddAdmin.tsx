"use client";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Admin } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Eye, EyeOff, Loader2, PencilLine, Plus, Trash } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AddAdminProps {
  admin: Admin | null;
}

const formSchema = z.object({
  email: z.string()
    .min(3, { message: "Email must be at least 3 characters long" })
    .email({ message: "Invalid email address" }),
  password: z.string()
    .min(3, { message: "Password must be at least 3 characters long" }),
});

const AddAdmin = ({ admin }: AddAdminProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: admin || {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
        const res = admin 
            ? await axios.patch(`/api/add/${admin.id}`, values) 
            : await axios.post("/api/add", values);
        
        alert(`Admin ${admin ? 'updated' : 'created'}.`); // Sử dụng alert
        router.push(`/add/${res.data.id}`);
    } catch (err: any) {
        console.error(err);
        if (err.response && err.response.status === 409) {
            alert("Email đã tồn tại!"); // Thông báo khi email đã tồn tại
        } else {
            alert("Email đã tồn tại!");
        }
    } finally {
        setIsLoading(false);
    }
};

  const handleDeleteAdmin = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/add/${admin?.id}`);
      toast({ variant: "default", description: "Admin deleted!" });
      router.push("/add/new");
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", description: `Could not delete admin! ${error.message}` });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleEmailBlur = () => {
    const email = form.getValues("email");
    if (email && !email.includes("@")) {
      form.setValue("email", `${email}@gmail.com`);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">
            {admin ? "Update Admin" : "Create Admin"}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name *</FormLabel>
                    <FormDescription>Enter your userName.</FormDescription>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
    control={form.control}
    name="password"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Password *</FormLabel>
        <FormDescription>Enter your password.</FormDescription>
        <FormControl>
          <div className="relative">
            <Input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              {...field}
              className=" pr-8" // Reduced padding for better fit
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {isPasswordVisible ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

            </div>
            <div className="flex-1 flex flex-col gap-6">

            </div>
          </div>
          <div className="flex justify-start gap-2 flex-wrap">
            {admin && (
              <Button
                onClick={handleDeleteAdmin}
                variant="ghost"
                type="button"
                className="max-w-[150px]"
                disabled={isDeleting || isLoading}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Deleting
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            )}
            <Button type="submit" className="max-w-[150px]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4" />
                  {admin ? 'Updating' : 'Creating'}
                </>
              ) : (
                <>
                  <PencilLine className="mr-2 h-4 w-4" />
                  {admin ? 'Update' : 'Create Admin'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex gap-2 mt-10">
        <Button onClick={handleBack} variant="ghost" className="text-gray-500 hover:text-gray-700 border border-gray-500 rounded-md">
          Back
        </Button>
      </div>
    </div>
  );
};

export default AddAdmin;
