"use client"
import MerchantOTPCodeForm from '@/components/custom/forms/merchant/reset/otp-code-form'
import { useParams,  } from 'next/navigation'
import React from 'react'

const VerifyCode = () => {

  const {email} = useParams() 

  const decodedEmail = typeof email === 'string' ? decodeURIComponent(email) : '';

  return (
    <main className="flex items-center w-full justify-center h-screen">
      <MerchantOTPCodeForm email={ decodedEmail}/>  
    </main>
  )
}

export default VerifyCode