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
import { Loader2 } from "lucide-react";
import {  useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { api_endpoints } from "@/utils/api_constants";
import { Card, CardContent } from "@/components/ui/card";

const pinConfigSchema = z.object({
  pin: z.string().min(8, { message: "PIN Must be 8 Digits" }),
});

const PinConfigurationForm = () => {
  const {  data: session } = useSession();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof pinConfigSchema>>({
    resolver: zodResolver(pinConfigSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handleSubmit =  async (values: z.infer<typeof pinConfigSchema>) => {
      const body ={
        user_id: session?.id,
        pin: values.pin
    }

    try {
        setLoading(true);
        const response= await fetch(api_endpoints.common.updatePin,{
            method:"POST",
            headers:{
                "Authorization": `Bearer ${session?.accessToken}`
            },
            body:JSON.stringify(body)
        })

        const data = await response.json();

        setLoading(false);

        if (data.status == "success"){
            toast.success(data.message); 
            window.location.reload()
        } else if(data.status =="failure"){
            toast.error(`${data.error}\n${data.detail}`)
        }                
    } catch (error) {
        console.log('error', error)
        toast.error("An unexpected error occurred");
    } finally {
        setLoading(false);
    }
   
  }



  return (
    <Card className="max-w-6xl w-full">
      <CardContent className="w-full mx-auto space-y-6">
      <div className="text-start space-y-2">
        <h1 className="text-xl font-bold">PIN Configuration</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">SET/UPDATE PIN (8 DIGITS)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter your pin"
                    className="bg-white/10 w-full focus:border-transparent focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />


          <Button
            type="submit"
            className="bg-[#00AEEF] rounded-lg text-black w-full font-semibold hover:bg-[#3c3c8c] hover:text-white py-2.5 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Setting...
              </>
            ) : (
              "Set/Update Pin"
            )}
          </Button>
        </form>
      </Form>
      </CardContent>
    </Card>
  );
};

export default PinConfigurationForm;
