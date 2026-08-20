"use client"
import React, { } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { MerchantSidebar } from "@/components/custom/merchant-sidebar";
import { AlertCircle } from "lucide-react";
import VerifyEmailForm from "@/components/custom/forms/merchant/email-verification/verify-email-form";
import { Button } from "@/components/ui/button";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from 'next-themes'
import { useRouter } from "next/navigation";
import { signInPathForRole } from "@/utils/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
  const { data: session, status } = useSession();
  const router = useRouter()

  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-800">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <button 
          onClick={()=> router.push(signInPathForRole("merchant"))}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Account inactive
  if (session.accountStatus === "inactive") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-800">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="flex items-center mb-4 text-red-500">
            <AlertCircle className="mr-2" size={24} />
            <h2 className="text-xl font-bold">Account Blocked</h2>
          </div>
          <p className="text-gray-600 mb-6">Your account has been deactivated. Please contact the administrator for assistance.</p>
          <div className="flex flex-col md:flex-row justify-between">
            <button className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              Contact Support
            </button>
            <button
              onClick={() => signOut({ callbackUrl: signInPathForRole("merchant") })}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Email not verified
  if (session.emailVerified === false) {
    return (
      <VerifyEmailForm />
    );
  }

  // Main dashboard layout
  return (
    <main className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-800">
      <SidebarProvider>
        <MerchantSidebar />
        <div className="flex flex-col flex-1 overflow-auto">
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Merchant </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-white hidden md:block">
                  Welcome, {session.user?.name || "Merchant"}
                </span>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? <FaSun /> : <FaMoon />}
                </Button>
              </div>
            </div>
          </header>
          <div className="p-6">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}