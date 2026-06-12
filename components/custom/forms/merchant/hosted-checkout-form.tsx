"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Loader2,
    CreditCard,
    Smartphone,
    Mail,
    User,
    Hash,
    CheckCircle2,
    Lock
} from "lucide-react";

import { api_endpoints } from "@/utils/api_constants";
import { HDetails } from "@/utils/types/HostedCheckout";

const hostedSchema = z.object({
    order_id: z.string().optional(),
    customer_name: z.string().min(2, "Name is required").optional(),
    customer_email: z.string().email("Invalid email address").optional(),
    amount: z.string().min(1, "Amount is required").optional(),
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
    const [txStatus, setTxStatus] = useState<"pending" | "successful" | "failed" | null>(null);

    const form = useForm<z.infer<typeof hostedSchema>>({
        resolver: zodResolver(hostedSchema),
        defaultValues: {
            order_id: details?.order_id || "",
            customer_email: details?.customer_email || "",
            customer_name: details?.customer_name || "",
            amount: details?.amount || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof hostedSchema>) => {
        // Enforcing phone number check if mobile money is selected layout-wise
        if (!phoneNumber || phoneNumber.length < 9) {
            toast.error("Please enter a valid mobile number");
            return;
        }

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
                `${api_endpoints.merchant.makeCheckoutRequest}/1`, // default status code passing
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
                const reference = data.data?.transaction_reference || "";

                setTxRef(reference);
                setTxStatus(data.data?.status || "pending");
                setDialog(true);

                toast.success(data.message || "Payment initiated");
                await new Promise(resolve => setTimeout(resolve, 5000));

                const return_url = data.data.return_url;
                window.location.href = return_url;
            } else {
                setTxStatus("failed");
                toast.error(data.error || "Payment failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4">
            <Card className="shadow-lg border-slate-200 dark:border-slate-800">
                <CardHeader className="space-y-1 text-center bg-slate-50/50 dark:bg-slate-900/50 border-b pb-6 rounded-t-xl">
                    <CardTitle className="text-xl font-bold tracking-tight flex items-center justify-center gap-2">
                        <Lock className="w-5 h-5 text-emerald-600" /> Secure Checkout
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Review details and complete your payment safely.
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* ORDER + AMOUNT */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="order_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        className="pl-9 bg-slate-50/50 disabled:opacity-80 font-mono text-sm"
                                                        disabled={!!details?.order_id}
                                                    />
                                                </div>
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
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount (ZMW)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-sm font-semibold text-muted-foreground">ZK</span>
                                                    <Input
                                                        {...field}
                                                        className="pl-9 bg-slate-50/50 font-semibold disabled:opacity-80"
                                                        disabled={!!details?.amount}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* CUSTOMER INFO */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                                <FormField
                                    control={form.control}
                                    name="customer_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Billing Name</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input {...field} placeholder="John Doe" className="pl-9" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="customer_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input {...field} placeholder="john@example.com" type="email" className="pl-9" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* PAYMENT METHOD */}
                            <div className="border-t pt-4">
                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
                                    Select Payment Method
                                </FormLabel>

                                <Tabs defaultValue="momo" className="w-full">
                                    <TabsList className="grid grid-cols-2 w-full p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        <TabsTrigger value="momo" className="py-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                            <Smartphone className="w-4 h-4 mr-2 text-indigo-600" />
                                            Mobile Money
                                        </TabsTrigger>
                                        <TabsTrigger value="bank" className="py-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                            <CreditCard className="w-4 h-4 mr-2 text-indigo-600" />
                                            Bank Card
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="momo" className="mt-4 space-y-2 animate-in fade-in-50 duration-200">
                                        <div className="relative flex items-center">
                                            <div className="absolute left-3 flex items-center pointer-events-none text-sm font-medium text-slate-400 border-r pr-2 h-5">
                                                +260
                                            </div>
                                            <Input
                                                type="tel"
                                                maxLength={9}
                                                placeholder="977XXXXXX"
                                                className="pl-16 tracking-wide font-medium"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground px-1">Enter your Mobile Wallet registration number.</p>
                                    </TabsContent>

                                    <TabsContent value="bank" className="mt-4 animate-in fade-in-50 duration-200">
                                        <div className="rounded-lg border border-dashed p-6 text-center bg-slate-50/50 dark:bg-slate-900/50">
                                            <p className="text-sm text-muted-foreground font-medium">
                                                Bank payments coming soon
                                            </p>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 text-base font-semibold shadow-md transition-all duration-150 hover:opacity-95 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Processing Securely...
                                    </span>
                                ) : (
                                    `Pay ${form.watch("amount") ? `ZK ${form.watch("amount")}` : ""}`
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* SUCCESS / REDIRECT DIALOG */}
            <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogContent className="sm:max-w-md text-center p-6">
                    <DialogHeader className="flex flex-col items-center justify-center pt-4">
                        <CheckCircle2 className="w-14 h-14 text-emerald-500 animate-bounce" />
                        <DialogTitle className="text-xl font-bold mt-4">
                            Payment Successful
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-2 space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm border">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-bold text-emerald-600 capitalize">{txStatus}</span>
                        </div>
                        <div className="flex flex-col items-start gap-1 text-left">
                            <span className="text-xs text-muted-foreground">Transaction Reference</span>
                            <span className="font-mono text-xs select-all break-all bg-slate-200/60 dark:bg-slate-800 p-1.5 rounded w-full">
                                {txRef}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="animate-spin h-3.5 w-3.5 text-emerald-600" />
                        <span>Redirecting back to Merchant platform...</span>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HostedCheckoutForm;