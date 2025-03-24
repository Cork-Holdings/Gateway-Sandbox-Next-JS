// SignInForm.tsx
"use client";
import React, { useEffect, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";

const SigninSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AdminSignInForm = () => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof SigninSchema>) => {
      try {
        setLoading(true);
        const signInResponse = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (signInResponse?.error) {
          toast.error("Invalid credentials");
          return;
        }

        toast.success("Sign in successful");
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/admin/dashboard");
    }
  }, [status, session, router]);

 
   return (
     <div className="w-full max-w-md mx-auto space-y-6">
       <div className="text-center space-y-2">
         <h1 className="text-3xl font-bold">Admin Sign In</h1>
         <p className="text-gray-700">Access the admin portal</p>
       </div>
 
       <Form {...form}>
         <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
           <FormField
             control={form.control}
             name="email"
             render={({ field }) => (
               <FormItem>
                 <FormLabel className="">Email</FormLabel>
                 <FormControl>
                   <Input
                     {...field}
                     type="email"
                     placeholder="Enter your email"
                     autoComplete="email"
                     className="bg-white/10 w-full focus:border-transparent focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                   />
                 </FormControl>
                 <FormMessage className="text-red-400" />
               </FormItem>
             )}
           />
 
           <FormField
             control={form.control}
             name="password"
             render={({ field }) => (
               <FormItem>
                 <FormLabel className="text-white">Password</FormLabel>
                 <FormControl>
                   <Input
                     {...field}
                     type="password"
                     placeholder="Enter your password"
                     autoComplete="current-password"
                     className="bg-white/10 w-full focus:border-transparent focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                   />
                 </FormControl>
                 <FormMessage className="text-red-400" />
               </FormItem>
             )}
           />
 
           <Button
             type="submit"
             className="bg-[#00AEEF] rounded-lg text-black w-full font-semibold hover:bg-[#3c3c8c] py-2.5 transition-colors"
             disabled={loading}
           >
             {loading ? (
               <>
                 <Loader2 className="h-5 w-5 animate-spin mr-2" />
                 Signing In...
               </>
             ) : (
               "Sign In"
             )}
           </Button>
         </form>
       </Form>
 
       <p className="text-center text-gray-700 text-sm">
         Forgot password?{" "}
         <a href="#" className="text-[#1383ec] hover:underline">
           Reset it
         </a>
       </p>
     </div>
   );
};

export default AdminSignInForm;
