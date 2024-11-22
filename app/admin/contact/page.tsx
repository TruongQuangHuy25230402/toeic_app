"use client";
import apiClient from "@/lib/api-client";
import { Contact, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useRouter } from "next/navigation";
import { USER_API_ROUTES } from "@/ultis/api-route";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/PageTitle";

export default function Page() {
  const [data, setData] = useState<Contact[]>([]);
  const router = useRouter();

  const handleAddHotel = () => {
    // Chuyển hướng đến trang "hotel/new"
    router.push("/exam/new");
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(USER_API_ROUTES.GET_CONTACT);
      if (response.data.contacts) setData(response.data.contacts);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <PageTitle title="Exam"/>
        <Button onClick={handleAddHotel}>Add Exam</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
