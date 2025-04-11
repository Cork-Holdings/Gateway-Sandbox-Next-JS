"use client";
import Header from "@/components/custom/common/Header";
import NewPasswordForm from "@/components/custom/forms/common/reset/new-password-form";
import { Key } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const SearchParamsWrapper = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  return (
    <div>
      <Header />
        <NewPasswordForm email={email} />
     
    </div>)

};

const NewPassword = () => {
  return (

    <main className="overflow-y-scroll  flex items-center md:items-start md:pt-32 justify-center w-full min-h-screen bg-gradient-to-br ">
      <div className="w-full max-w-3xl p-8 mx-4 bg-white rounded-xl shadow-lg border border-indigo-100 animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Key className="h-8 w-8 text-indigo-600" />
          </div>

        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <SearchParamsWrapper />
        </Suspense>
      </div>
    </main>
  );
};

export default NewPassword;
