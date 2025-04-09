"use client";
import MerchantNewPasswordForm from "@/components/custom/forms/merchant/reset/new-password-form";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const SearchParamsWrapper = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  
  return <MerchantNewPasswordForm email={email} />;
};

const NewPassword = () => {
  return (
    <main className="flex items-center w-full justify-center h-screen">
      <Suspense fallback={<p>Loading...</p>}>
        <SearchParamsWrapper />
      </Suspense>

    </main>
  );
};

export default NewPassword;
