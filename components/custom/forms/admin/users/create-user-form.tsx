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


import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from "lucide-react";
import { api_endpoints } from "@/utils/api_constants";
import toast from "react-hot-toast";


const signUpSchema = z.object({
    fullname: z.string().min(1, { message: "Fullname is required" }),
    email: z.string().min(1, { message: "Email is required" }),
    phone: z.string().min(1, { message: "Phone is required" }),
    password: z.string().min(8, { message: "Must be more than 8 characters" }),

})

const CreateUserForm = () => {
   
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullname: "", // Provide an initial empty string
            email: "",
            phone: "",
            password: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        setIsLoading(true)

        console.log(values)
        try {

            const body = {
                "fullname": values.fullname,
                "email": values.email,
                "password": values.password,
                "phone": values.phone,
                "role": "admin",
            }
            const res = await fetch(api_endpoints.auth.Register, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })

            const responseBody = await res.json()
            if (responseBody.status === "success") {
                toast.success("You have successfully created a user")
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
                    <h1 className="text-2xl text-gray-900 dark:text-white font-bold">Create A User</h1>
                    <p className="text-gray-600 text-sm dark:text-gray-400">Fill in the following details</p>
                </div>

                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="fullname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Full Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="John Doe"
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Email Address</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="email"
                                        placeholder="john.doe@example.com"
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
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Phone Number</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
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
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="password"
                                        placeholder="••••••••"
                                        className="border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        {...field}
                                    />
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
                        Create User
                    </Button>
                </div>

                
            </form>
        </Form>
    </div>

    );
};


export default CreateUserForm;