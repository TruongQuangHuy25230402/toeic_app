import { getAdminById } from '@/actions/get-admin'
import AddAdmin from '@/components/admin/AddAdmin'
import AddToeicExamForm from '@/components/exam/AddToeicExamForm'
import React from 'react'

interface AdminPageProps {
    params: {
        adminId: string
    }
}

const Admin = async({params} : AdminPageProps) => {
    const admin = await getAdminById(params.adminId); 
    
  return (
    <div>
      <AddAdmin admin={admin}/>
    </div>
  )
}

export default Admin;
