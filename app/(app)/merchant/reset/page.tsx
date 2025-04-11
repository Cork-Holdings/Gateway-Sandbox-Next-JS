import MerchantResetForm from '@/components/custom/forms/merchant/reset/reset-form';
import React from 'react';
import { LockKeyhole } from 'lucide-react';

const ResetPage = () => {
  return (
    <main className="flex items-center md:items-start md:pt-32 justify-center w-full min-h-screen bg-gradient-to-br ">
      <div className="w-full max-w-3xl max-h-xl p-8 mx-4 bg-white rounded-xl shadow-lg border border-indigo-100 animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <LockKeyhole className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Reset Your Password
          </h2>
          <p className="text-sm text-gray-500 text-center mt-2">
            We&apos;ll send you a secure reset code
          </p>
        </div>
        <MerchantResetForm />
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Need help? <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default ResetPage;