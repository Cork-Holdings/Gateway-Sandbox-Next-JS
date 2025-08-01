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
import { UserDetails } from "@/utils/types/Users";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";


interface EditUserFormProps {
 user: UserDetails | null;

}


const editUserSchema = z.object({
    fullname: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().optional(),
    status:z.string().optional()

})

const EditUserForm : React.FC<EditUserFormProps> = ({ user }) => {
   
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {data:session} = useSession()

    const form = useForm<z.infer<typeof editUserSchema>>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            fullname: user?.fullname ||"", // Provide an initial empty string
            email: user?.email ||"",
            phone: user?.phone ||"",
            status :user?.status ||""
        }
    });

    const onSubmit = async (values: z.infer<typeof editUserSchema>) => {
        setIsLoading(true)

        console.log(values)
        try {

          const body = {
                "fullname": values.fullname,
                "email": values.email,
                "phone": values.phone,
                id: user?.id,
                status: values.status
            }
            const res = await fetch(api_endpoints.backoffice.editUser, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":`Bearer ${session?.accessToken}`
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
        } 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (error) {
            toast.error("An unexpected error occurred. Please try again.")
          
        }
        finally {
            setIsLoading(false)
        }
    }



    return (
        <div className="w-full dark:bg-inherit rounded-2xl lg:px-8 px-4 py-12 sm:px-6">
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="bg-white p-6  w-full dark:bg-inherit max-w-4xl space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-2xl text-gray-900 dark:text-white font-bold">Edit a user</h1>
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
                                        className="border-gray-300 rounded-md w-full  dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                                        className="border-gray-300 rounded-md w-full  dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                                        placeholder="260 968 72689"
                                        className="border-gray-300 rounded-md w-full  dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                                                control={form.control}
                                                name="status"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Status Code</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="border-gray-300 rounded-md w-full  dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500">
                                                                    <SelectValue placeholder="Select a status code" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="active">Active</SelectItem>
                                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                               </SelectContent>
                                                        </Select>
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
                        Update User
                    </Button>
                </div>

                
            </form>
        </Form>
    </div>

    );
};


export default EditUserForm;