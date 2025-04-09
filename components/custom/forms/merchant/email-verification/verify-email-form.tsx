"use client"
import { api_endpoints } from '@/utils/api_constants';
import { AlertCircle, Loader2 } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';




const VerifyEmailForm = () => {
    const { data: session } = useSession();
    const [isLoading, setLoading] = useState<boolean>(false)

    const router = useRouter()

    const requestCode = async () => {


        const body = {
            "to": session?.email,
            "code": "It shall be generated",
            "subject": "Email verfication",
            "body": "Here is your email verification code.",
            "userID": "",
        }

        try {
            setLoading(true);
            const response = await fetch(api_endpoints.common.requestCode, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data["status"] == "success") {
                toast.success("Code sent successfully!");
                router.push(`/common/reset/email/${session?.email}`)
            } else {
                toast.error(data.error || "Failed to send code");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
            console.error(error);
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
                <div className="flex items-center mb-4 text-amber-500">
                    <AlertCircle className="mr-2" size={24} />
                    <h2 className="text-xl font-bold">Email Verification Required</h2>

                </div>
                <p className="text-gray-600 mb-6">Please verify your email address to access your account.</p>
                <p className="pb-2">Email will be sent to <strong>{session?.email}</strong></p>

              
                    <div className="flex space-x-4 justify-between">
                        <button 
                        disabled={isLoading}
                        onClick={()=> requestCode()}
                        className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
                          {isLoading &&<Loader2 className='h-4 w-4 animate-spin'/> } Request Code
                        </button>
                        <button
                            onClick={() => signOut({ callbackUrl: "/auth/signin/merchant" })}
                            className="px-6 py-2 bg-red-200 text-red-800 rounded-md hover:bg-red-300 transition-colors">
                            Sign Out
                        </button>

                    </div>

            </div>

        </div>
    )
}

export default VerifyEmailForm