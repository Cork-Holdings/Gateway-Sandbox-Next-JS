"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api_endpoints } from "@/utils/api_constants";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";


interface OtpCodeProps {
    email:string
}


const MerchantOTPCodeForm: React.FC<OtpCodeProps> = ({ email }) => {
  const [otp, setOtp] = useState("");

  const router = useRouter()

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

    const body ={
        code: otp,
        email: email
    }


    try {

        
    const response = await fetch(api_endpoints.common.verifyCode, {
        method:"POST",
        body:JSON.stringify(body)

    })


    const data = await response.json()

    if(data.status == "success"){
        toast.success("Code Verified!")
        router.push(`/merchant/reset/password?email=${email}`)
    }
    else if (data.status == "failure"){
      toast.error(`${data.error}\n${data.detail}`)
        window.location.reload()
    }
        
    } 
     // eslint-disable-next-line @typescript-eslint/no-unused-vars                                     
    catch (error) {
        toast.error(`Something went wrong. Please try again`)
        window.location.reload()
    }

}

  return (
  
    <div className="w-full">
      <h2 className="text-xl font-semibold text-center mb-4">Enter OTP Code</h2>
        

          <div className="mb-6">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Mail className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                A code has been sent to <strong>{email || "your email"}</strong>
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            maxLength={6}
            value={otp}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter 6-digit OTP"
          />

          <Button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-indigo-600 text-white p-2  hover:bg-blue-600 transition"
          >
            Submit OTP
          </Button>
        </form>
        
          
          
        </div>
  );
};

export default MerchantOTPCodeForm;
