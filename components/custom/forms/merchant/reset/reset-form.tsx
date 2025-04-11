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
  email: z.string()
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
      "to": session?.email,
      "code": "It shall be generated",
      "subject": "Password Reset Request",
      "body": "Password Reset Code",
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
        <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
          <Mail className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            A reset code will be sent to <strong>{session?.email || "your email"}</strong>
          </p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending Reset Code...
              </>
            ) : (
              <>
                Send Reset Code
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Form>
      
      
    </div>
  );
};

export default MerchantResetForm;