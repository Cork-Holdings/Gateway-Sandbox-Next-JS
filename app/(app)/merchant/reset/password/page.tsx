"use client";
import MerchantNewPasswordForm from "@/components/custom/forms/merchant/reset/new-password-form";
import { Key } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const SearchParamsWrapper = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  return <MerchantNewPasswordForm email={email} />;
};

const NewPassword = () => {
  return (

    <main className="overflow-y-scroll flex items-center md:items-start md:pt-32 justify-center w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
      <div className="w-full max-w-3xl p-8 mx-4 bg-white rounded-xl shadow-lg border border-indigo-100 animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Key className="h-8 w-8 text-indigo-600" />
          </div>

        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <SearchParamsWrapper />
        </Suspense>
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Need help? <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default NewPassword;
