"use client"
import Header from '@/components/custom/common/Header'
import OTPCodeForm from '@/components/custom/forms/common/reset/otp-code-form'
import { useParams, } from 'next/navigation'
import React from 'react'

const VerifyCode = () => {

  const { email } = useParams()

  const decodedEmail = typeof email === 'string' ? decodeURIComponent(email) : '';

  return (
    <main>
      <Header />
      <div className="flex flex-col items-center w-full justify-center h-[70vh]">
        <OTPCodeForm email={decodedEmail} />
      </div>

    </main>
  )
}

export default VerifyCode