"use client"
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { api_endpoints } from '@/utils/api_constants';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const MerchantResetSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

const MerchantResetForm = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof MerchantResetSchema>>({
    resolver: zodResolver(MerchantResetSchema),
    defaultValues: {
      email: session?.email || "",
    }
  });

  const onSubmit = async (values: z.infer<typeof MerchantResetSchema>) => {
    const body = {
      "to": values.email || session?.email,
      "code": "It shall be generated",
      "subject": "Password Reset Request",
      "body": "Password Reset Code",
      "userID": "",
    }

    try {
      setLoading(true);
      const response = await fetch(api_endpoints.common.requestCode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data["status"] === "success") {
        toast.success("Reset code sent successfully!");
        router.push(`/merchant/reset/${values.email}`);
      } else {
        toast.error(data.error || "Failed to send reset code");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.error(error);
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
            A reset verification code will be dispatched securely to <strong>{session?.email || "your primary account email"}</strong>
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3977BF] hover:bg-[#3B3C8C] text-white py-5 h-auto rounded-xl font-medium transition-all shadow-sm shadow-[#3977BF]/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Security Code...
              </>
            ) : (
              <>
                Send Verification Code
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MerchantResetForm;