
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";



const CoursesPage = async() => {
    const {userId} = auth()
    if(!userId){
        return redirect("/lms")
    }
    const courses = await prisma.course.findMany({
        where: {
            userId,
        },
        orderBy:{
            createdAt: "desc"
        }
    })
    return (    
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
            
        </div>
      );
}
 
export default CoursesPage;