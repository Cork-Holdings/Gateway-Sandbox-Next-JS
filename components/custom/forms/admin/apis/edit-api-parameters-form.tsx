

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
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group";
import { useSession } from "next-auth/react";
import { APIParameterDetails } from "@/utils/types/APIs";


interface EditAPIParameterFormProps {
    parameter: APIParameterDetails | null;
}




const apiConfigSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" })
    ,
    type: z.string()
        .min(1, { message: "Type is required" }),
    isRequired: z.boolean(),


});

type ApiConfigFormValues = z.infer<typeof apiConfigSchema>;

const EditAPIParametersForm : React.FC<EditAPIParameterFormProps> = ({ parameter }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {data:session} = useSession()
    const form = useForm<ApiConfigFormValues>({
        resolver: zodResolver(apiConfigSchema),
        defaultValues: {
            name: "",
            type: "",
            isRequired: false,

        }
    });

    const onSubmit = async (values: ApiConfigFormValues) => {
        setIsLoading(true);
        try {
            const body = {
                name: values.name,
                type: values.type,
                "api_id": parameter?.api_id,
                "is_required": values.isRequired,
            };

            const res = await fetch(api_endpoints.backoffice.createAPiParameter, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify(body)
            });

            const responseBody: { status: string; error?: string } = await res.json();

            // console.log('responseBody', responseBody)
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
                        <h1 className="text-2xl text-gray-900 dark:text-white font-bold">API Parameter Configuration</h1>
                        <p className="text-gray-600 text-sm dark:text-gray-400">Configure API parameters</p>
                    </div>
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Paramter Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="For example Client ID"
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
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Type</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="For example string, float, int"
                                            className="border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                        name="isRequired"
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

export default EditAPIParametersForm;