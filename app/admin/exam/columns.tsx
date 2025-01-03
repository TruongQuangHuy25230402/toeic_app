
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import axios from "axios"; // Import axios
import { useRouter } from "next/navigation";

 

  export type Exam = {
   
  id:          string;      
  title:       string;
  description: string;
  userId: string;
  createdAt:   Date;   
  updatedAt:   Date;    


  };

  const UpdateButton = ({ id }: { id: string }) => {
    const router = useRouter();
  
    const handleUpdate = () => {
      router.push(`/exam/${id}`);
    };
  
    return <Button onClick={handleUpdate}>Update</Button>;
  };
  // Function to handle delete action
  const handleDelete = async (id: string) => {
    // Hiển thị hộp thoại xác nhận
    const confirmed = window.confirm("Bạn có chắc muốn xóa không?");
    if (!confirmed) {
      return; // Hủy nếu người dùng chọn "Cancel"
    }
  
    try {
      // Gửi yêu cầu DELETE đến API
      const response = await axios.delete(`/api/exam/${id}`);
      console.log("Response from delete:", response.data);
  
      // Tải lại trang hoặc thực hiện hành động khác khi xóa thành công
      window.location.reload();
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error deleting item:", error);
    }
  };

  export const columns: ColumnDef<Exam>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "userId",
      header: "UserID",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
          const createdAt = new Date(row.original.createdAt);
          return createdAt.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
          const updatedAt = new Date(row.original.updatedAt);
          return updatedAt.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
      },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <UpdateButton id={row.original.id} />
            <Button
              onClick={() => handleDelete(row.original.id)} // Thay handleDelete bằng hàm xử lý xóa
            >
              Delete
            </Button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
  
  ];