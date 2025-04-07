"use client"
import { Card, CardContent } from "@/components/ui/card";
import { api_endpoints } from "@/utils/api_constants";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";


interface OtpCodeProps {
    email:string
}


const OTPCodeForm: React.FC<OtpCodeProps> = ({ email }) => {
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
        router.push(`/common/reset/password?email=${email}`)
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
    <Card className="max-w-2xl w-full flex flex-col items-center justify-center">
            <CardContent className='w-full'> 
       <p className="py-5">The email has been sent to {email}</p>
        <h2 className="text-xl font-semibold text-center mb-4">Enter OTP Code</h2>
        

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter 6-digit OTP"
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
          >
            Submit OTP
          </button>
        </form>

      
      </CardContent>
    </Card>
  );
};

export default OTPCodeForm;
