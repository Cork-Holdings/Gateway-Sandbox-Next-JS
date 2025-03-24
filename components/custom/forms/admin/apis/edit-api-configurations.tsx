

"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from "lucide-react";
import { api_endpoints } from "@/utils/api_constants";
import toast from "react-hot-toast";
import { APIResponseDetails } from "@/utils/types/APIs";




interface EditAPIResponseFormProps {
    configuration: APIResponseDetails | null;
}



const apiConfigSchema = z.object({
    statusCode: z.string()
        .min(1, { message: "Status code is required" })
        .regex(/^\d{3}$/, { message: "Must be a valid 3-digit HTTP status code" }),
    condition: z.string()
        .min(1, { message: "Condition is required" })
        .regex(/^(query:|header:|body:|method:|role:|time:)/, { message: "Condition must start with a valid prefix (query:, header:, body:, method:, role:, time:)" }),
    response: z.string()
        .min(1, { message: "Response is required" })
        .refine(
            (val) => {
                try {
                    JSON.parse(val);
                    return true;
                } catch {
                    return false;
                }
            },
            { message: "Must be valid JSON" }
        ),
});


type ApiConfigFormValues = z.infer<typeof apiConfigSchema>;

const EditAPIConfigurationsForm: React.FC<EditAPIResponseFormProps> = ({ configuration }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<ApiConfigFormValues>({
        resolver: zodResolver(apiConfigSchema),
        defaultValues: {
            statusCode: "",
            condition: "",
            response: "",
        }
    });

    const onSubmit = async (values: ApiConfigFormValues) => {
        setIsLoading(true);
        try {
            const body = {
                statusCode: values.statusCode,
                condition: values.condition,
                response: values.response,
                role: "admin",
            };

            const res = await fetch(api_endpoints.auth.adminRegister, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const responseBody: { status: string; error?: string } = await res.json();

            if (responseBody.status === "success") {
                toast.success("API Configuration saved successfully");
                form.reset();
            } else if (responseBody.status === "failure") {
                toast.error(responseBody.error || "Failed to save configuration");
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full dark:bg-gray-900 lg:px-8 px-4 py-12 sm:px-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-white p-6 rounded-xl shadow-lg w-full dark:bg-gray-800 max-w-4xl space-y-8"
                >
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl text-gray-900 dark:text-white font-bold">API Configuration</h1>
                        <p className="text-gray-600 text-sm dark:text-gray-400">Configure API response settings</p>
                    </div>
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="statusCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Status Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="200, 401, 403,500, 201"
                                            className="border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="condition"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Condition</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="e.g. query:user_id=123"
                                            className="border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                    <div className="text-sm text-gray-500 mt-1">
                                        Enter conditions with the following format:
                                        <ul className="list-disc ml-5">
                                            <li>query:exampleParam=value</li>
                                            <li>header:Authorization=Bearer <code>your-token</code></li>
                                            <li>body:email=user@example.com</li>
                                            <li>method:POST</li>
                                            <li>role:admin</li>
                                            <li>time:09:00-17:00</li>
                                        </ul>
                                    </div>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="response"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">JSON Response</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="{ 'error': 'Unauthorized action. You do not have permission to delete this movie.',
                                              'status': 403}"
                                            className="border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 rounded-md text-white w-full disabled:opacity-50 duration-200 font-medium hover:bg-blue-700 px-4 py-2 transition-colors"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Save Configuration
                    </Button>
                </form>
            </Form>
        </div>

    );
};

export default EditAPIConfigurationsForm;