import MerchantResetForm from '@/components/custom/forms/merchant/reset/reset-form';
import React from 'react';

const ResetPage = () => {
  return (
    <main className="flex items-center justify-center w-full h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Reset Account
          </h2>
          <p className="text-sm text-gray-600">
            Please enter your details below
          </p>
        </div>
        <MerchantResetForm />
      </div>
    </main>
  );
}

export default ResetPage;