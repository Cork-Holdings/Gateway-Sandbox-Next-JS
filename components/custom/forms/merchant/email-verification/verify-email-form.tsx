"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api_endpoints } from '@/utils/api_constants';
import { AlertCircle, BadgeAlertIcon, Loader2, LogOut, CheckCircle } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const VerifyEmailForm = () => {
    const { data: session } = useSession();
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

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
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <Card className="w-full max-w-2xl shadow-xl border-0">
                <CardContent className="flex flex-col items-center space-y-8 p-12">
                    {/* Step Indicator */}
                    <div className="flex w-full justify-center items-center mb-4">
                        <div className="flex items-center">
                            <div className="bg-orange-400 rounded-full p-3 flex items-center justify-center">
                                <span className="text-white text-base font-bold">1</span>
                            </div>
                            <div className="text-lg font-medium text-black-600 ml-3">Request Code</div>
                        </div>
                        <div className="h-2 w-24 bg-gray-200 mx-4">
                            <div className="h-2 w-0 bg-indigo-600"></div>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-gray-200 rounded-full p-3 flex items-center justify-center">
                                <span className="text-gray-500 text-base font-bold">2</span>
                            </div>
                            <div className="text-lg font-medium text-gray-500 ml-3">Verify Email</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-indigo-600 rounded-full p-6 flex items-center justify-center">
                        <BadgeAlertIcon className="text-white h-12 w-12" />
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Email Verification Required</h2>
                        <p className="text-xl text-gray-600">We'll send a verification code to your email</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg w-full text-center border border-blue-100">
                        <p className="text-lg text-gray-600 mb-2">Code will be sent to:</p>
                        <p className="text-xl font-semibold text-gray-800 break-all">{session?.email}</p>
                    </div>

                    <div className="flex flex-col  gap-6 w-full">
                        <Button 
                            disabled={isLoading}
                            onClick={() => requestCode()}
                            className="flex-1 px-8 py-6 bg-gradient-to-r from-orange-600 to-purple-600 text-white text-lg rounded-lg hover:from-orange-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin mr-3" />
                            ) : (
                                <CheckCircle className="h-6 w-6 mr-3" />
                            )}
                            {isLoading ? "Sending..." : "Send Verification Code"}
                        </Button>
                        
                        <Button
                            onClick={() => signOut()}
                            className="flex-none px-6 py-4 bg-gray-100 text-gray-700 text-lg rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center">
                            <LogOut className="h-5 w-5 mr-3" /> Sign out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyEmailForm