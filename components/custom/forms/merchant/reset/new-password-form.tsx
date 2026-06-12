"use client"
import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { api_endpoints } from '@/utils/api_constants'

const MerchantNewPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

interface MerchantNewPasswordFormProps {
    email: string
}

const MerchantNewPasswordForm: React.FC<MerchantNewPasswordFormProps> = ({ email }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const form = useForm<z.infer<typeof MerchantNewPasswordSchema>>({
        resolver: zodResolver(MerchantNewPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof MerchantNewPasswordSchema>) => {
        const body = {
            email: email,
            password: values.password,
            confirm_password: values.confirmPassword,
            logged_in: false,
            user_id: "",
        }

        try {
            setLoading(true)
            const response = await fetch(api_endpoints.common.resetPassword, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json()

            if (data.status === "success") {
                toast.success("Password Updated Successfully!");
                router.push("/merchant/dashboard")
            } else {
                toast.error(`Failed to reset password: ${data.error}`);
            }
        } catch (error) {
            toast.error(`An unexpected error occurred. Please try again.`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 font-medium">New Password</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                            className="pr-12 rounded-xl border-slate-200 focus-visible:ring-[#3977BF] focus-visible:border-[#3977BF]"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 text-slate-400 hover:text-slate-600 h-9 w-9 rounded-lg"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 font-medium">Confirm New Password</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                            className="pr-12 rounded-xl border-slate-200 focus-visible:ring-[#3977BF] focus-visible:border-[#3977BF]"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 text-slate-400 hover:text-slate-600 h-9 w-9 rounded-lg"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-[#3977BF] hover:bg-[#3B3C8C] text-white h-12 rounded-xl font-medium transition-all shadow-sm shadow-[#3977BF]/10 flex items-center justify-center gap-2 mt-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving Password...</>
                        ) : (
                            <><Save className="h-4 w-4" /> Save & Reset Password</>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default MerchantNewPasswordForm;