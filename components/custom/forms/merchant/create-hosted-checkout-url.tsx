"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { api_endpoints } from "@/utils/api_constants";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const hostedSchema = z.object({
    order_id: z.string().optional(),
    customer_name: z.string().optional(),
    customer_email: z.string().email().optional(),
    amount: z.string().email().optional(),
});




const HostedCheckoutUrlForm =(
    {
  
}) => {
    const { data: session } = useSession();
    const [loading, setLoading] = React.useState(false);
    const router = useRouter()

    const form = useForm<z.infer<typeof hostedSchema>>({
        resolver: zodResolver(hostedSchema),
        defaultValues: {
            order_id:  "",
            customer_email:   "",
            customer_name:  "",
            amount: "",
        },
    });


    const handleSubmit = async (values: z.infer<typeof hostedSchema>) => {


        const body = {}

        try {
            setLoading(true);
            const response = await fetch(api_endpoints.merchant.makeCheckoutRequest, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            setLoading(false);

            if (data.status == "success") {
                toast.success(data.message);

                router.push("")



            } else if (data.status == "failure") {
                toast.error(`${data.error}\n${data.detail}`);
            }
        } catch (error) {
            console.log('error', error);
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Card className="max-w-6xl w-full">
            <CardContent className="w-full mx-auto space-y-6">
                <div className="text-start space-y-2">
                    <h1 className="text-xl font-bold">Geepay Sandbox Hosted Checkout</h1>
                </div>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="order_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Order ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter your Client Secret"
                                            className="bg-white/10 w-full focus:border-transparent focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter an amount"
                                            className="bg-white/10 w-full focus:border-transparent focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="customer_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter your email"
                                            className="bg-white/10 w-full focus:border-transparent focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="customer_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className=""> Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter your name"
                                            className="bg-white/10 w-full focus:border-transparent focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                        <Tabs defaultValue="momo" className="w-full">
                            <TabsList>
                                <TabsTrigger value="momo">Mobile Money</TabsTrigger>
                                <TabsTrigger value="bank">Bank</TabsTrigger>
                            </TabsList>
                            <TabsContent value="momo">
                                <Input
                                    prefix="260"
                                    type="number"
                                    placeholder="Enter your phone number"
                                />
                            </TabsContent>
                            <TabsContent value="bank" >
                                
                            </TabsContent>
                        </Tabs>

                        <Button
                            type="submit"
                            className="bg-[#00AEEF] rounded-lg text-black w-full font-semibold hover:bg-[#3c3c8c] hover:text-white py-2.5 transition-colors"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Intiating payment....
                                </>
                            ) : (
                                "Pay"
                            )}
                        </Button>
                    </form>
                </Form>

       
            </CardContent>
        </Card>
    );
};

export default HostedCheckoutUrlForm;