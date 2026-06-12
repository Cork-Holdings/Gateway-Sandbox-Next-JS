"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api_endpoints } from "@/utils/api_constants";
import { Mail, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface OtpCodeProps {
  email: string
}

const MerchantOTPCodeForm: React.FC<OtpCodeProps> = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Keep numeric only
    setOtp(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("OTP must be exactly 6 digits!");
      return;
    }

    const body = { code: otp, email: email };

    try {
      setLoading(true);
      const response = await fetch(api_endpoints.common.verifyCode, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Code Verified Successfully!");
        router.push(`/merchant/reset/password?email=${email}`);
      } else {
        toast.error(`${data.error || 'Verification failed'}`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-start p-4 bg-slate-50 rounded-xl border border-slate-100">
          <Mail className="h-5 w-5 text-[#3977BF] mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed">
            We have sent a verification security code to <strong>{email || "your registered email"}</strong>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Secure 6-Digit One-Time Password
          </label>
          <Input
            type="text"
            maxLength={6}
            value={otp}
            onChange={handleChange}
            className="w-full text-center tracking-[0.5em] text-xl font-bold h-12 rounded-xl border-slate-200 focus-visible:ring-[#3977BF] focus-visible:border-[#3977BF]"
            placeholder="000000"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full h-12 rounded-xl bg-[#3977BF] hover:bg-[#3B3C8C] text-white font-medium transition-all shadow-sm shadow-[#3977BF]/10 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          {loading ? "Verifying..." : "Verify & Continue"}
        </Button>
      </form>
    </div>
  );
};

export default MerchantOTPCodeForm;