// "use client";
// import React, { useState } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Loader2, CreditCard, Smartphone } from "lucide-react";
// import { useSession } from "next-auth/react";
// import toast from "react-hot-toast";
// import { api_endpoints } from "@/utils/api_constants";
// import { CardContent, CardHeader, CardDescription } from "@/components/ui/card";
// import { useRouter } from "next/navigation";
// import { HDetails } from "@/utils/types/HostedCheckout";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog"

// const hostedSchema = z.object({
//     order_id: z.string().optional(),
//     customer_name: z.string().optional(),
//     customer_email: z.string().email().optional(),
//     amount: z.string().optional(),
// });

// interface hostedCheckoutFormProps {
//     details: HDetails | null
// }

// const HostedCheckoutForm: React.FC<hostedCheckoutFormProps> = ({ details }) => {
//     const { data: session } = useSession();
//     const [loading, setLoading] = React.useState(false);
//     const router = useRouter();

//     const [dialog, setDialog] = useState<boolean>(false);
//     const [phoneNumber, setPhoneNumber] = useState<string>("");
//     const form = useForm<z.infer<typeof hostedSchema>>({
//         resolver: zodResolver(hostedSchema),
//         defaultValues: {
//             order_id: details?.order_id || "",
//             customer_email: details?.customer_email || "",
//             customer_name: details?.customer_name || "",
//             amount: details?.amount || "",
//         },
//     });

//     const handleSubmit = async (values: z.infer<typeof hostedSchema>, statusCode: number) => {
//         const body = {
//             checkout_id: details?.checkout_url?.split("/").pop() || "",
//             amount: values.amount,
//             phone_number: `260${phoneNumber}`,
//             customer_email: values.customer_email,
//             customer_name: values.customer_name
//         }
 
//         try {
//             setLoading(true);
//             const response = await fetch(`${api_endpoints.merchant.makeCheckoutRequest}/${statusCode}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${session?.accessToken}`
//                 },
//                 body: JSON.stringify(body)
//             });

//             const data = await response.json();
//             setLoading(false);

//             console.log('data', data)

//             if (data.status == "success" || data.code == 200) {
//                 toast.success(data.message || "Payment processed");

//                 await new Promise(resolve => setTimeout(resolve, 3000))
//                 setDialog(true);

//                 const txId = data.data?.transaction_id || "";
//                 const returnUrl = details?.return_url || "";
//                 const redirectUrl = txId ? `${returnUrl}${returnUrl.includes("?") ? "&" : "?"}transaction_id=${txId}` : returnUrl;

//                 if (redirectUrl.startsWith("http://") || redirectUrl.startsWith("https://")) {
//                     window.location.href = redirectUrl;
//                 } else {
//                     router.push(redirectUrl);
//                 }
//             } else if (data.status == "failure") {
//                 toast.error(`${data.error}`);
//                 router.push(details?.return_url || "");
//             }

//             else if (data.status == "cancelled") {
//                 toast.error(`${data.message}`);
//                 router.push(details?.return_url || "");
//             }
//         } catch (error) {
//             console.log('error', error);
//             toast.error("An unexpected error occurred");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="w-full max-w-md mx-auto">
//             <CardHeader className="pb-2">

//                 <CardDescription className="text-center text-gray-500">
//                     Complete your payment securely
//                 </CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-6">




//                 <Form {...form}>
//                     <form className="space-y-5">
//                         <div className="grid grid-cols-1  gap-4">
//                             <FormField
//                                 control={form.control}
//                                 name="order_id"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel className="font-medium text-gray-700">Order ID</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 disabled={!!details?.order_id}
//                                                 {...field}
//                                                 type="text"
//                                                 placeholder="Order ID"
//                                                 className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md"
//                                             />
//                                         </FormControl>
//                                         <FormMessage className="text-red-500" />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="amount"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel className="font-medium text-gray-700">Amount</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 disabled={!!details?.amount}
//                                                 {...field}
//                                                 type="text"
//                                                 placeholder="0.00"
//                                                 className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md"
//                                             />
//                                         </FormControl>
//                                         <FormMessage className="text-red-500" />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <FormField
//                                 control={form.control}
//                                 name="customer_email"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel className="font-medium text-gray-700">Email</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 disabled={!!details?.customer_email}
//                                                 {...field}
//                                                 type="email"
//                                                 placeholder="your@email.com"
//                                                 className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md"
//                                             />
//                                         </FormControl>
//                                         <FormMessage className="text-red-500" />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="customer_name"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel className="font-medium text-gray-700">Name</FormLabel>
//                                         <FormControl>
//                                             <Input
//                                                 disabled={!!details?.customer_name}
//                                                 {...field}
//                                                 type="text"
//                                                 placeholder="Full Name"
//                                                 className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md"
//                                             />
//                                         </FormControl>
//                                         <FormMessage className="text-red-500" />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         <div className="mt-6">
//                             <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Method</h3>
//                             <Tabs defaultValue="momo" className="w-full">
//                                 <TabsList className="grid grid-cols-2 mb-4">
//                                     <TabsTrigger value="momo" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
//                                         <Smartphone className="w-4 h-4 mr-2" />
//                                         Mobile Money
//                                     </TabsTrigger>
//                                     <TabsTrigger value="bank" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
//                                         <CreditCard className="w-4 h-4 mr-2" />
//                                         Bank
//                                     </TabsTrigger>
//                                 </TabsList>
//                                 <TabsContent value="momo" className="p-4 rounded-md">
//                                     <FormLabel className="font-medium text-gray-700 mb-2 block">
//                                         Phone Number
//                                     </FormLabel>
//                                     <div className="flex items-center border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 rounded-md overflow-hidden">
//                                         <span className="px-3 text-gray-700  border-r border-gray-300 text-sm select-none">
//                                             +260
//                                         </span>
//                                         <Input
//                                             type="number"
//                                             maxLength={9}
//                                             placeholder="Enter 9-digit number"
//                                             className="border-0 focus:ring-0 focus:outline-none"
//                                             value={phoneNumber}
//                                             onChange={(e) => setPhoneNumber(e.target.value)}
//                                         />
//                                     </div>
//                                 </TabsContent>

//                                 <TabsContent value="bank" className="p-4 border rounded-md bg-gray-50">
//                                     <p className="text-gray-600">Bank payment options coming soon.</p>
//                                 </TabsContent>
//                             </Tabs>
//                         </div>

//                         <div className="mt-8 grid grid-cols-1  gap-3">
//                             <Button
//                                 type="submit"
//                                 className="w-full py-3 bg-blue-500  text-white font-medium rounded-md shadow transition-all"
//                                 disabled={loading}
//                                 onClick={() => form.handleSubmit((values) => handleSubmit(values, 1))()}

//                             >
//                                 {loading ? (
//                                     <>
//                                         <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                                         Processing...
//                                     </>
//                                 ) : (
//                                     "Submit"
//                                 )}
//                             </Button>
//                             {/* <Button
//                                 type="submit"
//                                 className="w-full py-3 bg-red-500 hover:bg-red-700 text-white font-medium rounded-md shadow transition-all"
//                                 disabled={loading}
//                                 onClick={() => form.handleSubmit((values) => handleSubmit(values, 3))()}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                                         Processing...
//                                     </>
//                                 ) : (
//                                     "Simulate Failed"
//                                 )}
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 className="w-full py-3 bg-orange-500 hover:bg-orange-700 text-white font-medium rounded-md shadow transition-all"
//                                 disabled={loading}
//                                 onClick={() => form.handleSubmit((values) => handleSubmit(values, 2))()}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                                         Processing...
//                                     </>
//                                 ) : (
//                                     "Simulate cancelled"
//                                 )}
//                             </Button> */}
//                         </div>

//                         <div className="flex items-center justify-center space-x-2 mt-4">
//                             <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
//                                     <rect width="20" height="14" x="2" y="5" rx="2" />
//                                     <line x1="2" x2="22" y1="10" y2="10" />
//                                 </svg>
//                             </div>
//                             <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
//                                     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//                                     <polyline points="22 4 12 14.01 9 11.01" />
//                                 </svg>
//                             </div>
//                             <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
//                                     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//                                 </svg>
//                             </div>
//                         </div>
//                     </form>
//                 </Form>
//             </CardContent>

//             {dialog && <Dialog open={dialog} onOpenChange={setDialog}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle className="flex items-center gap-2">
//                             <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
//                             <p>  Redirecting...</p>
//                         </DialogTitle>
//                     </DialogHeader>
//                     <p className="text-gray-600 text-sm">Please wait while we redirect you to the return URL.</p>
//                 </DialogContent>
//             </Dialog>


//             }
//         </div>
//     );
// };

// export default HostedCheckoutForm;
"use client";

import React, { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, CreditCard, Smartphone, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { api_endpoints } from "@/utils/api_constants";
import { CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { HDetails } from "@/utils/types/HostedCheckout";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const hostedSchema = z.object({
    order_id: z.string().optional(),
    customer_name: z.string().optional(),
    customer_email: z.string().email().optional(),
    amount: z.string().optional(),
});

interface Props {
    details: HDetails | null;
}

const HostedCheckoutForm: React.FC<Props> = ({ details }) => {
    const { data: session } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [dialog, setDialog] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState("");

    const [txRef, setTxRef] = useState("");
    const [txStatus, setTxStatus] = useState<
        "pending" | "success" | "failed" | null
    >(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const form = useForm<z.infer<typeof hostedSchema>>({
        resolver: zodResolver(hostedSchema),
        defaultValues: {
            order_id: details?.order_id || "",
            customer_email: details?.customer_email || "",
            customer_name: details?.customer_name || "",
            amount: details?.amount || "",
        },
    });

    const stopPolling = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    // const pollTransactionStatus = (reference: string) => {
    //     stopPolling();

    //     intervalRef.current = setInterval(async () => {
    //         try {
    //             const res = await fetch(
    //                 `${api_endpoints.merchant.getTransactionStatus}/${reference}`,
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${session?.accessToken}`,
    //                     },
    //                 }
    //             );

    //             const data = await res.json();
    //             const status = data?.data?.status;

    //             setTxStatus(status);

    //             if (status === "success" || status === "successful") {
    //                 stopPolling();
    //                 toast.success("Payment successful");
    //                 setDialog(false);
    //                 router.push(details?.return_url || "");
    //             }

    //             if (status === "failed" || status === "cancelled") {
    //                 stopPolling();
    //                 toast.error("Payment failed");
    //                 setDialog(false);
    //                 router.push(details?.return_url || "");
    //             }
    //         } catch (err) {
    //             console.log("poll error", err);
    //         }
    //     }, 3000);

    //     timeoutRef.current = setTimeout(() => {
    //         stopPolling();
    //     }, 120000);
    // };

    const handleSubmit = async (
        values: z.infer<typeof hostedSchema>,
        statusCode: number
    ) => {
        try {
            setLoading(true);

            const body = {
                checkout_id: details?.checkout_url?.split("/").pop() || "",
                amount: values.amount,
                phone_number: `260${phoneNumber}`,
                customer_email: values.customer_email,
                customer_name: values.customer_name,
            };

            const response = await fetch(
                `${api_endpoints.merchant.makeCheckoutRequest}/${statusCode}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await response.json();

            if (data.status === "success" || data.code === 200) {
                const reference =
                    data.data?.transaction_reference || "";

                setTxRef(reference);
                setTxStatus(data.data?.status || "pending");
                setDialog(true);

                toast.success(data.message || "Payment initiated");

                // pollTransactionStatus(reference);
            } else {
                setTxStatus("failed");
                toast.error(data.error || "Payment failed");
            }
        } catch (error) {
            console.log(error);
            toast.error("Unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">

            <CardHeader className="pb-2">
                <CardDescription className="text-center text-gray-500">
                    Complete your payment securely
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

                <Form {...form}>
                    <form className="space-y-5">

                        {/* ORDER + AMOUNT */}
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="order_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Order ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!!details?.order_id}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!!details?.amount}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* CUSTOMER INFO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="customer_email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="customer_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* PAYMENT METHOD */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">
                                Payment Method
                            </h3>

                            <Tabs defaultValue="momo">
                                <TabsList className="grid grid-cols-2">
                                    <TabsTrigger value="momo">
                                        <Smartphone className="w-4 h-4 mr-2" />
                                        Mobile Money
                                    </TabsTrigger>

                                    <TabsTrigger value="bank">
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Bank
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="momo" className="mt-4">
                                    <Input
                                    type="number"
                                    maxLength={9}
                                        placeholder="Phone number"
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                    />
                                </TabsContent>

                                <TabsContent value="bank">
                                    <p className="text-sm text-gray-500">
                                        Bank payments coming soon
                                    </p>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* SUBMIT */}
                        <Button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                form.handleSubmit((v) =>
                                    handleSubmit(v, 1)
                                )()
                            }
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                "Submit Payment"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>

            {/* STATUS DIALOG */}
            <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-center gap-2">
                            {txStatus === "pending" && (
                                <Clock className=" text-orange-600" />
                            )}
                            {txStatus === "success" && "Payment Successful"}
                            {txStatus === "failed" && "Payment Failed"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="text-sm space-y-2">
                        <p>Status: <span className="font-medium capitalize">{txStatus}</span></p>
                        <p className="break-all">
                            Reference: {txRef}
                        </p>

                        {/* {txStatus === "pending" && (
                            <p className="text-gray-500">
                                Waiting for confirmation...
                            </p>
                        )} */}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HostedCheckoutForm;