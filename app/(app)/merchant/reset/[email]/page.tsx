"use client"
import MerchantOTPCodeForm from '@/components/custom/forms/merchant/reset/otp-code-form'
import { FileDigit, CheckCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

const VerifyCode = () => {
  const { email } = useParams() 
  const decodedEmail = typeof email === 'string' ? decodeURIComponent(email) : '';

  return (
    <main className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
      <div className="w-full max-w-2xl p-12 mx-4 bg-white rounded-xl shadow-xl border border-indigo-100 animate-fadeIn">
        {/* Step Indicator */}
        <div className="flex w-full justify-center items-center mb-8">
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-full p-3 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-lg font-medium text-green-600 ml-3">Request Code</div>
          </div>
          <div className="h-2 w-24 bg-gradient-to-r from-green-500 to-indigo-600 mx-4"></div>
          <div className="flex items-center">
            <div className="bg-indigo-600 rounded-full p-3 flex items-center justify-center">
              <span className="text-white text-base font-bold">2</span>
            </div>
            <div className="text-lg font-medium text-indigo-600 ml-3">Verify Email</div>
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="h-24 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <FileDigit className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Verify Your Account
          </h2>
          <p className="text-xl text-gray-600 text-center mt-3">
            We&apos;ve sent you an OTP code to continue
          </p>
        </div>
        
        <MerchantOTPCodeForm email={decodedEmail}/>  
        
        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Need help? <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </main>
  )
}

export default VerifyCode