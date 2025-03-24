"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import React, {  useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from "lucide-react";
import { api_endpoints } from "@/utils/api_constants";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

const createProjectSchema = z.object({
    name: z.string().min(1, { message: "Project Name is required" }),
    description: z.string().min(1, { message: "Project Description is required" }),
    isPublic: z.boolean(),
});

const CreateProjectForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {data:session} = useSession()
  
    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: "",
            description: "",
            isPublic: false,
        },
    });

    const onSubmit = async (values: z.infer<typeof createProjectSchema>) => {
       
       

        setIsLoading(true);
        console.log("Submitting with values:", values);
        try {
            const body = {
                name: values.name,
                description: values.description,
            };
            const res = await fetch(api_endpoints.backoffice.createProject, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`, // Use session.accessToken
                },
                body: JSON.stringify(body),
            });


            const responseBody = await res.json();
            if (responseBody.status === "success") {
                toast.success("You have successfully created a project");
                window.location.reload();
            } else if (responseBody.status === "failure") {
                toast.error(responseBody.error);
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

  

    return (
        <div className="w-full dark:bg-gray-900 lg:px-8 px-4 py-12 sm:px-6">
            {/* <p> Session {session?.accessToken}</p> */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-lg w-full dark:bg-gray-800 max-w-4xl space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl text-gray-900 dark:text-white font-bold">Create A Project</h1>
                        <p className="text-gray-600 text-sm dark:text-gray-400">Fill in the following details</p>
                    </div>
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Project Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Project Alpha"
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 text-sm dark:text-gray-300 font-medium">Project Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Project Description"
                                            className="border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 min-h-[120px]"
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
                            Create Project
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateProjectForm;