// SignInForm.tsx
"use client";
import React, { useEffect, useCallback } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { api_endpoints } from "@/utils/api_constants";
import { Label } from "@/components/ui/label";


interface CredentialsFormProps {
    clientID: string,
    clientSecret: string

}


const APICredentialsForm: React.FC<CredentialsFormProps> = ({ clientID, clientSecret }: CredentialsFormProps) => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const { data: session } = useSession()



    const handleSubmit = async () => {
        const body = {
            user_id: session?.id
        }

        try {
            setLoading(true);
            const response = await fetch(api_endpoints.common.generateSecret, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify(body)
            })

            const data = await response.json();

            setLoading(false);

            if (data.status == "success") {
                toast.success("Secret Regenerated");
                window.location.reload()
            } else if (data.status == "failure") {
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
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">API Credentials</h1>
                <p className="text-gray-700">Manage your API credentials below. Ensure your Client Secret and PIN are stored securely.</p>
            </div>

            <div className="flex flex-col gap-3">
                <Label>Client ID</Label>
                <Input
                    disabled
                    type="text"
                    placeholder={clientID}
                    className="bg-white/10 w-full focus:border-transparent focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                />

            </div >


            <div className="flex flex-col gap-3">

                <Label>Client Secret</Label>
                <Input
                    disabled
                    type="text"
                    placeholder={clientSecret}
                    className="bg-white/10 w-full focus:border-transparent focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                />


            </div>

            <Button
                onClick={() => handleSubmit()}
                type="submit"
                className="bg-[#00AEEF] rounded-lg text-black w-full font-semibold hover:bg-[#3c3c8c] hover:text-white py-2.5 transition-colors"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Regenerating Secret...
                    </>
                ) : (
                    "Regenerate Secret"
                )}
            </Button>

        </div>
    );
};

export default APICredentialsForm;
