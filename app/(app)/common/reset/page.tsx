import Header from '@/components/custom/common/Header';
import ResetForm from '@/components/custom/forms/common/reset/reset-form';
import { LockKeyhole } from 'lucide-react';
import React from 'react'

const ResetPage = () => {
  return (

    <main>
      <Header />
      <div className="flex items-center md:items-start md:pt-24 justify-center w-full min-h-screen bg-gradient-to-br ">

        <div className="w-full max-w-3xl max-h-xl p-8 mx-4 bg-white rounded-xl shadow-lg border border-indigo-100 animate-fadeIn">
          <div className="flex flex-col items-center mb-6">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <LockKeyhole className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Reset Your Password
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2">
              We'll send you a secure reset code
            </p>
          </div>
          <ResetForm />
          
        </div>
      </div>
    </main>
  );
}

export default ResetPage