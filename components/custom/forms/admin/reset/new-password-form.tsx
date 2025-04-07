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
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Card, CardContent } from '@/components/ui/card'
import { api_endpoints } from '@/utils/api_constants'


const AdminNewPasswordSchema = z.object({
    confirmPassword: z.string().min(8,{ message: "Password must be at least 8 characters" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
})


interface AdminNewPasswordFormProps {
    email: string
}


const AdminNewPasswordForm: React.FC<AdminNewPasswordFormProps> = ({ email }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [toggleHidePassword, setToggleHidePassword] = useState<boolean>(false);
    const [toggleHidePasswordC, setToggleHidePasswordC] = useState<boolean>(false);

    const form = useForm<z.infer<typeof AdminNewPasswordSchema>>({
        resolver: zodResolver(AdminNewPasswordSchema),
        defaultValues: {
            confirmPassword: '',
            password: '',

        }
    })

    const onSubmit = async (values: z.infer<typeof AdminNewPasswordSchema>) => {

        const body = {
             email : email,
             password :values.password,
             confirm_password : values.confirmPassword,
             logged_in :false,
             user_id : "",
        }

        if(values.password!= values.confirmPassword){
            toast.error("Password do not match")
            return
        }
        try {
            setLoading(true)
            const response = await fetch(api_endpoints.common.resetPassword, {
                method:"POST",
                body: JSON.stringify(body)
          
            });


            const data = await response.json()
            setLoading(false)

            if (data.status == "success") {
                toast.success("Password Reset");
                router.push("/admin/dashboard")
            }

            else if (data.status == "failure") {
                toast.error(`Failed to reset password\n ${data.error}`);
            }

        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars                                          
        catch (error) {
            setLoading(false);
            toast.error(`An Unexpected error Happened! Try Again`);
        } finally {
            setLoading(false);
        }

    }


    const handleVisibility = async () => {
        setToggleHidePassword(!toggleHidePassword)
    }
    const handleVisibilityC = async () => {
        setToggleHidePasswordC(!toggleHidePasswordC)
    }

    return (
        
        <Card className="max-w-2xl w-full flex flex-col items-center justify-center">
            <CardContent className='w-full'>
                   <div className=" p-8 md:p-12 flex flex-col justify-center">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold ">Reset Password</h1>
                                <p className="text-gray-700">Enter your new password</p>
                            </div>


                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Password</FormLabel>
                                        <FormControl>
                                            <div className='flex'>
                                                <Input
                                                    type={toggleHidePassword ? "password" : "text"}
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    className="  placeholder-gray-400 focus:border-amber-500"
                                                />
                                                <Button
                                                    type='reset'
                                                    variant="ghost" onClick={handleVisibility}>{toggleHidePassword ? <FaEye /> : <FaEyeSlash />}</Button>
                                            </div>


                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Confirm Password</FormLabel>
                                        <FormControl>
                                        <div className='flex'>
                                                <Input
                                                    type={toggleHidePasswordC ? "password" : "text"}
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    className="  placeholder-gray-400 focus:border-amber-500"
                                                />
                                                <Button
                                                    type='reset'
                                                    variant="ghost" onClick={handleVisibilityC}>{toggleHidePasswordC ? <FaEye /> : <FaEyeSlash />}</Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            
                            <Button
                                type="submit"
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</>
                                ) : (
                                    "Reset"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            
            </CardContent>
        </Card>

    )
}

export default AdminNewPasswordForm