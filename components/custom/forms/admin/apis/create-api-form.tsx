"use client"
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { api_endpoints } from "@/utils/api_constants";
import toast from "react-hot-toast";
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group";
import { useSession } from "next-auth/react";

const signUpSchema = z.object({
    name: z.string().min(1, { message: "Fullname is required" }),
    endpoint: z.string().min(1, { message: "Email is required" }),
    method: z.string().min(1, { message: "Method is required" }),
    description: z.string().min(8, { message: "Must be more than 8 characters" }),
    requiresAuth: z.boolean(),
})

const CreateAPIForm = ({projectID}: {projectID : string}) => {
    const {data: session} = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            endpoint: "",
            method: "",
            description: "",
            requiresAuth: false
        }
    });

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        setIsLoading(true)
        console.log(values)
        try {
            const body = {
                "name": values.name,
                "endpoint": values.endpoint,
                "description": values.description,
                "method": values.method,
                "requiresAuth": values.requiresAuth,
                "project_id":projectID,
            }
            const res = await fetch(api_endpoints.backoffice.createApi, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":`Bearer ${session?.accessToken}`
                },
                body: JSON.stringify(body)
            })

            const responseBody = await res.json()

            console.log('responseBody', responseBody)
            if (responseBody.status === "success") {
                toast.success("You have successfully created an API")
                window.location.reload()
            } else if(responseBody.status === "failure") {
                toast.error(responseBody.error)
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.")
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full dark:bg-gray-900 lg:px-8 px-4 py-12 sm:px-6">
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="bg-white p-6 rounded-xl shadow-lg w-full dark:bg-gray-800 max-w-4xl space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-2xl text-gray-900 dark:text-white font-bold">Create API route</h1>
                    <p className="text-gray-600 text-sm dark:text-gray-400">Fill in the following details</p>
                </div>

                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">API Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Fetch Movie Details"
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
                        name="endpoint"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Endpoint</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="endpoint"
                                        placeholder="/v1/movies/get"
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
                        name="method"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">API Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500">
                                            <SelectValue placeholder="Select a method" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">API Description</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="text"
                                        placeholder="API Description"
                                        className="border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="requiresAuth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Requires Authentication</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value.toString()}
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
                        Create API
                    </Button>
                </div>
            </form>
        </Form>
    </div>
    );
};

export default CreateAPIForm;