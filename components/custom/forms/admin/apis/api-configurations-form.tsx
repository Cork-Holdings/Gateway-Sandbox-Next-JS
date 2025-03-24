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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from "lucide-react";
import { api_endpoints } from "@/utils/api_constants";
import toast from "react-hot-toast";
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";

const apiConfigSchema = z.object({
    statusCode: z.enum(["200", "201", "400", "401", "403", "404", "500"], {
        required_error: "Status code is required"
    }),
    condition: z.string()
        .min(1, { message: "Condition is required" })
    ,
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
    requiresAuth: z.boolean(),
});

type ApiConfigFormValues = z.infer<typeof apiConfigSchema>;

const APIConfigurationsForm = ({ apiID, }: { apiID: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { data: session } = useSession()

    const form = useForm<ApiConfigFormValues>({
        resolver: zodResolver(apiConfigSchema),
        defaultValues: {
            statusCode: "200", // Default value for select
            condition: "",
            response: "",
            requiresAuth: false,
        }
    });

    const onSubmit = async (values: ApiConfigFormValues) => {
        setIsLoading(true);
        try {
            const body = {
                "status_code": values.statusCode,
                condition: values.condition,
                response: values.response,
                "requiresAuth": values.requiresAuth,
                "api_id": apiID,
            };

            const res = await fetch(api_endpoints.backoffice.createApiResponse, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify(body)
            });


            const responseBody= await res.json();

            console.log('responseBody', responseBody)
            if (responseBody.status === "success") {
                toast.success("API Configuration saved successfully");
                form.reset();
            } else if (responseBody.status === "failure") {
                toast.error(`${responseBody.error }\n ${responseBody.detail}`);
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
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500">
                                                <SelectValue placeholder="Select a status code" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="200">200 - OK</SelectItem>
                                            <SelectItem value="201">201 - Created</SelectItem>
                                            <SelectItem value="400">400 - Bad Request</SelectItem>
                                            <SelectItem value="401">401 - Unauthorized</SelectItem>
                                            <SelectItem value="403">403 - Forbidden</SelectItem>
                                            <SelectItem value="404">404 - Not Found</SelectItem>
                                            <SelectItem value="500">500 - Server Error</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                        <div className="flex space-x-2">
                                            <Input
                                                className="border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                {...field}
                                                placeholder="Enter condition (e.g., user_id=123)"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />

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
                                        <Textarea

                                            placeholder="{ 'error': 'Unauthorized action. You do not have permission to delete this movie.', 'status': 403}"
                                            className="border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="requiresAuth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Requires Authentication</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(value) => field.onChange(value === "true")} // Convert string to boolean
                                        defaultValue={field.value.toString()} // Ensure default value is a string for RadioGroup
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="auth-true" />
                                            <FormLabel htmlFor="auth-true" className="font-normal">Yes</FormLabel>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="auth-false" />
                                            <FormLabel htmlFor="auth-false" className="font-normal">No</FormLabel>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                        )}
                    />

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

export default APIConfigurationsForm;