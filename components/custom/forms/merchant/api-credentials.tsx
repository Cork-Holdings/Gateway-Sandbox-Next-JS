// SignInForm.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, Copy, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { api_endpoints } from "@/utils/api_constants";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface CredentialsFormProps {
    clientID: string,
    clientSecret: string
}

const APICredentialsForm: React.FC<CredentialsFormProps> = ({ clientID, clientSecret }: CredentialsFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const { data: session } = useSession();
    const [showClientID, setShowClientID] = useState(false);
    const [showClientSecret, setShowClientSecret] = useState(false);
    const [copiedID, setCopiedID] = useState(false);
    const [copiedSecret, setCopiedSecret] = useState(false);

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
                window.location.reload();
                setCopiedSecret(false);
                setCopiedID(false);
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

    const copyToClipboard = (text: string, type: 'id' | 'secret') => {
        navigator.clipboard.writeText(text)
            .then(() => {
                if (type === 'id') {
                    setCopiedID(true);
                    toast.success("Client ID copied to clipboard!");
                    setTimeout(() => setCopiedID(false), 2000);
                } else {
                    setCopiedSecret(true);
                    toast.success("Client Secret copied to clipboard!");
                    setTimeout(() => setCopiedSecret(false), 2000);
                }
            })
            .catch(err => {
                toast.error(`Failed to copy ${type === 'id' ? 'Client ID' : 'Client Secret'}`);
                console.error('Failed to copy: ', err);
            });
    }
    
    return (
        <Card className="max-w-6xl w-full">
        <CardContent className="w-full  mx-auto space-y-6 pt-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">API Credentials</h1>
                <p className="text-gray-700">Manage your API credentials below. Ensure your Client Secret and PIN are stored securely.</p>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Client ID</Label>
                <div className="relative">
                    <Input
                        readOnly
                        type={showClientID ? "text" : "password"}
                        value={clientID}
                        className="bg-white/10 w-full pr-20 focus:border-transparent focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowClientID(!showClientID)}
                            className="h-full px-2 py-0"
                        >
                            {showClientID ? 
                                <EyeOff className="h-4 w-4" /> : 
                                <Eye className="h-4 w-4" />
                            }
                        </Button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => copyToClipboard(clientID, 'id')}
                            className="h-full px-2 py-0"
                        >
                            {copiedID ? 
                                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                                <Copy className="h-4 w-4" />
                            }
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Client Secret</Label>
                <div className="relative">
                    <Input
                        readOnly
                        type={showClientSecret ? "text" : "password"}
                        value={clientSecret}
                        className="bg-white/10 w-full pr-20 focus:border-transparent focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowClientSecret(!showClientSecret)}
                            className="h-full px-2 py-0"
                        >
                            {showClientSecret ? 
                                <EyeOff className="h-4 w-4" /> : 
                                <Eye className="h-4 w-4" />
                            }
                        </Button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => copyToClipboard(clientSecret, 'secret')}
                            className="h-full px-2 py-0"
                        >
                            {copiedSecret ? 
                                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                                <Copy className="h-4 w-4" />
                            }
                        </Button>
                    </div>
                </div>
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
        </CardContent>
        </Card>
    );
};

export default APICredentialsForm;