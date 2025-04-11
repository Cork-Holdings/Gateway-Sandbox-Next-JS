"use client";
import React, { useState } from "react";
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
import { Loader2, Copy, CheckCircle, EyeOff, Eye } from "lucide-react";
import {  useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { api_endpoints } from "@/utils/api_constants";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const oauthSchema = z.object({
  pin: z.string().min(8, { message: "PIN Must be 8 Digits" }),
  clientSecret: z.string().min(1, { message: "Client Secret is required" }),
  clientID: z.string().min(1, { message: "Client ID is required" }),
});

const OAuthSignatureForm = ({signature}: {signature:string}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);
   const [copiedSignature, setCopiedSignature] = useState(false);
       const [showSignature, setSignature] = useState(false);

  const form = useForm<z.infer<typeof oauthSchema>>({
    resolver: zodResolver(oauthSchema),
    defaultValues: {
      pin: "",
      clientID: "",
      clientSecret: ""
    },
  });

  const handleSubmit = async (values: z.infer<typeof oauthSchema>) => {
    const body = {
      user_id: session?.id,
      client_pin: values.pin,
      client_id: values.clientID,
      secret_key: values.clientSecret
    }

    try {
      setLoading(true);
      const response = await fetch(api_endpoints.common.generateSignature, {
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
        setOutput(data.signature);
        setCopied(false);
        setCopiedSignature(false);
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

  const copyToClipboard = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output)
      .then(() => {
        setCopied(true);
        toast.success("Signature copied to clipboard!");
        
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(err => {
        toast.error("Failed to copy signature");
        console.error('Failed to copy: ', err);
      });
  };

  const copySignature = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            
                setCopiedSignature(true);
                toast.success("Client Signature copied to clipboard!");
                setTimeout(() => setCopiedSignature(false), 2000);
            
        })
        .catch(err => {
            toast.error(`Failed to copy your O-Auth-Signature`);
            console.error('Failed to copy: ', err);
        });
}

  return (
    <Card className="max-w-6xl w-full">
    <CardContent className="w-full mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">OAUTH Signature Management</h1>
          <Separator/>
      </div>

      <div className="flex flex-col gap-3">
                <Label>Current Signature</Label>
                <div className="relative">
                    <Input
                        readOnly
                        type={showSignature ? "text" : "password"}
                        value={signature || "No signature Available"}
                        className="bg-white/10 w-full pr-20 focus:border-transparent focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setSignature(!showSignature)}
                            className="h-full px-2 py-0"
                        >
                            {showSignature ? 
                                <EyeOff className="h-4 w-4" /> : 
                                <Eye className="h-4 w-4" />
                            }
                        </Button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => copySignature(signature)}
                            className="h-full px-2 py-0"
                        >
                            {copiedSignature ? 
                                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                                <Copy className="h-4 w-4" />
                            }
                        </Button>
                    </div>
                </div>
            </div>
            

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="clientSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Client Secret</FormLabel>
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
            name="clientID"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Client ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter your client ID"
                    className="bg-white/10 w-full focus:border-transparent focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=""> PIN (8 DIGITS)</FormLabel>
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
                Generating....
              </>
            ) : (
              "Generate Signature"
            )}
          </Button>
        </form>
      </Form>

      {output && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md relative">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium mb-2">Generated Signature:</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="absolute top-2 right-2"
              title="Copy to clipboard"
            >
              {copied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          <div className="break-all bg-white p-3 rounded border mt-2 text-sm font-mono">
            {output}
          </div>
        </div>
      )}
    </CardContent>
    </Card>
  );
};

export default OAuthSignatureForm;