"use client";
import AdminNewPasswordForm from "@/components/custom/forms/admin/reset/new-password-form";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const SearchParamsWrapper = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  
  return <AdminNewPasswordForm email={email} />;
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
