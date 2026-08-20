"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api_endpoints } from "@/utils/api_constants";
import {  CheckCircle, FileDigit,  Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { signInPathForRole } from "@/utils/auth";
import React, { useState } from "react";
import toast from "react-hot-toast";


interface OtpCodeProps {
  email: string
}


const VerifyEmailOTPCodeForm: React.FC<OtpCodeProps> = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { data: session } = useSession();

  // Handle OTP input
  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setOtp(e.target.value);
  };


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("OTP must be 6 digits!");
      return;
    }

    const body = {
      code: otp,
      email: email
    }


    try {

      setLoading(true)


      const response = await fetch(api_endpoints.common.verifyCode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)

      })


      const data = await response.json()

      setLoading(false)

      if (data.status == "success") {
        toast.success("Code Verified!")
       signOut({ callbackUrl: signInPathForRole(session?.role) })
      }
      else if (data.status == "failure") {
        toast.error(`${data.error}\n${data.detail}`)
        window.location.reload()
      }

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars                                     
    catch (error) {
      setLoading(false)
      toast.error(`Something went wrong. Please try again`)
      window.location.reload()
    }

  }

  return (

        <form onSubmit={handleSubmit} className="space-y-4">


          <Card className="w-full max-w-2xl shadow-xl border-0">
            <CardContent className="flex flex-col items-center space-y-8 p-12">
              {/* Step Indicator */}
              <div className="flex w-full justify-center items-center mb-4">
                <div className="flex items-center">
                  <div className="bg-green-400 text-white rounded-full p-3 flex items-center justify-center">
                   <CheckCircle/>
                  </div>
                  <div className="text-lg font-medium text-black-600 ml-3">Request Code</div>
                </div>
                <div className="h-2 w-24 bg-gradient-to-r from-green-500 to-indigo-600 mx-4">
                  <div className="h-2 w-0 bg-indigo-600"></div>
                </div>
                <div className="flex items-center">
                  <div className="bg-indigo-500 rounded-full p-3 flex items-center justify-center">
                    <span className="text-white-500 text-base font-bold">2</span>
                  </div>
                  <div className="text-lg font-medium text-gray-500 ml-3">Verify Email</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-indigo-600 rounded-full p-6 flex items-center justify-center">
                <FileDigit className="text-white h-12 w-12" />
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Enter OTP Code</h2>
                <p className="text-xl text-gray-600">We have sent a verification code to your email</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg w-full text-center border border-blue-100">
      
                <p className="text-lg text-gray-600 mb-2">The verification code has been sent to {email}</p>
      
              </div>

              <div className="flex flex-col  gap-6 w-full">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter 6-digit OTP"
                />
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="flex-1 px-8 py-6 bg-gradient-to-r from-orange-600 to-purple-600 text-white text-lg rounded-lg hover:from-orange-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mr-3" />
                  ) : (
                    <CheckCircle className="h-6 w-6 mr-3" />
                  )}
                  {isLoading ? "Verifying" : "Submit OTP"}
                </Button>


              </div>
            </CardContent>
          </Card>
        </form>

    
  );
};

export default VerifyEmailOTPCodeForm;
