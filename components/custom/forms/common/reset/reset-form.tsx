"use client"
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api_endpoints } from '@/utils/api_constants';
import { useRouter } from 'next/navigation';

const SubmitTestimonySchema = z.object({
    email: z.string()
});

const ResetForm = () => {

    const [loading, setLoading] = useState(false);

    const router = useRouter()

    const form = useForm<z.infer<typeof SubmitTestimonySchema>>({
        resolver: zodResolver(SubmitTestimonySchema),
        defaultValues: {
            email: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof SubmitTestimonySchema>) => {

        const body = {
            "to": values.email,
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

            console.log('response', response)
            const data = await response.json();

            console.log('data', data)
            if (data["status"] == "success") {
                toast.success("Code sent successfully!");
                router.push(`/common/reset/${values.email}`)
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

        <div>             
             <p className='text-xl font-bold pb-2'>Request A code</p>
            <p className='text-sm font-normal pb-6'>Enter the email address to which the code should be sent to</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


             <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="johndoe@example.com"
                                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



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
        </div>

    );
};

export default ResetForm;