"use client"
import VerifyEmailOTPCodeForm from '@/components/custom/forms/common/reset/verify-email-code-form'
import { useParams,  } from 'next/navigation'
import React from 'react'

const VerifyCode = () => {

  const {email} = useParams() 

  const decodedEmail = typeof email === 'string' ? decodeURIComponent(email) : '';

  return (
    <main className="flex items-center w-full justify-center h-screen">
      <VerifyEmailOTPCodeForm email={ decodedEmail}/>  
    </main>
  )
}

export default VerifyCode