
"use client"
import AdminResetForm from '@/components/custom/forms/admin/reset/reset-form';
import {useSearchParams } from 'next/navigation';
import React from 'react'

const ResetPage = () => {

    const searchParams = useSearchParams() 

    const email = searchParams.get("email")
    const decodedEmail = typeof email === 'string' ? decodeURIComponent(email) : '';
  
  return (
    <main className="flex items-center w-full justify-center h-screen">
     <AdminResetForm email={decodedEmail}/>
    </main>
);
}

export default ResetPage