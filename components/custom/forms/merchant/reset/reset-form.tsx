"use client"
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import {
    Form,

} from "@/components/ui/form";
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api_endpoints } from '@/utils/api_constants';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

const MerchantResetSchema = z.object({
    email: z.string()
});

const MerchantResetForm = () => {

    const [loading, setLoading] = useState(false);

    const {data:session} = useSession()

    const router = useRouter()

    const form = useForm<z.infer<typeof MerchantResetSchema>>({
        resolver: zodResolver(MerchantResetSchema),
        defaultValues: {
            email: session?.email ||"",
        }
    });

    const onSubmit = async (values: z.infer<typeof MerchantResetSchema>) => {

        const body = {
            "to": session?.email,
            "code": "It shall be generated",
            "subject": "Password Request",
            "body": "Password Request Code",
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
                router.push(`/merchant/reset/${values.email}`)
            } else {
                toast.error(data.error || "Failed to send code");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl w-full flex flex-col items-center justify-center">
            <CardContent className='w-full'>
                <p className='text-xl font-bold pb-2'>Request A code</p>
                <p className='text-sm font-normal pb-6'>Email will be sent to {" "}  <strong>{session?.email}</strong></p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Requesting Code...
                                </>
                            ) : (
                                "Request Code"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default MerchantResetForm;