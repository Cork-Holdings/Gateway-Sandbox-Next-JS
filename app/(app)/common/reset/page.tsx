import Header from '@/components/custom/common/Header';
import ResetForm from '@/components/custom/forms/common/reset/reset-form';
import React from 'react'

const ResetPage = () => {
  return (
    <main>
      <Header />
      <div className="flex flex-col items-center w-full justify-center h-[70vh]">
        <ResetForm />
      </div>

    </main>

  );
}

export default ResetPage