"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { api_endpoints, base_ip, base_url, sandbox_url } from '@/utils/api_constants';
import { API, APIDetails, APIHeaderDetails, APIParameterDetails, APIResponseDetails } from '@/utils/types/APIs';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { ArrowRight, Code, FileJson, Info, Play, Settings } from 'lucide-react';

interface APIContainerProps {
    parameters: APIParameterDetails[] | null;
    headers: APIHeaderDetails[] | null;
    responses: APIResponseDetails[] | null;
    api: APIDetails | null;
}

// Define the possible method and status code keys
type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type StatusCode = '200' | '201' | '400' | '401' | '403' | '404' | '500';

const methodColors: Record<MethodType, string> = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-amber-100 text-amber-800',
    DELETE: 'bg-red-100 text-red-800',
    PATCH: 'bg-purple-100 text-purple-800',
};

const statusColors: Record<StatusCode, string> = {
    '200': 'bg-green-100 text-green-800',
    '201': 'bg-green-100 text-green-800',
    '400': 'bg-amber-100 text-amber-800',
    '401': 'bg-amber-100 text-amber-800',
    '403': 'bg-amber-100 text-amber-800',
    '404': 'bg-red-100 text-red-800',
    '500': 'bg-red-100 text-red-800',
};

// Define the API response type
interface ApiResponse {
    status?: StatusCode; // Match the keys of statusColors
    response?: any;
    request?: {
        url: string;
        method: string;
        headers: Record<string, string>;
        params: Record<string, any>;
    };
    error?: string;
    details?: any;
}

const ApiContainer: React.FC<APIContainerProps> = ({ parameters, headers, responses, api }) => {
    const [apiResponse, setApiResponse] = useState<ApiResponse | undefined>(undefined);
    const [paramValues, setParamValues] = useState<Record<string, string>>({});
    const [headerValues, setHeaderValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'request' | 'response' | 'docs'>('request');

    const handleParamChange = (paramName: string, value: string) => {
        setParamValues((prev) => ({ ...prev, [paramName]: value }));
    };

    const handleHeaderChange = (headerName: string, value: string) => {
        setHeaderValues((prev) => ({ ...prev, [headerName]: value }));
    };

    const { data: session } = useSession();

    const makeRequest = async () => {
        if (!api) return;

        setLoading(true);

        try {
            const requestHeaders: Record<string, string> = {
                Authorization: `Bearer ${session?.accessToken}`,
                ...Object.fromEntries(
                    headers?.map((header) => {
                        const headerValue = headerValues[header.name];
                        return headerValue ? [header.name, headerValue] : null;
                    }).filter(Boolean) as [string, string][]
                ),
            };

            const requestParams: Record<string, any> = {
                ...Object.fromEntries(
                    parameters?.map((param) => {
                        const paramValue = paramValues[param.name];
                        return paramValue ? [param.name, paramValue] : null;
                    }).filter(Boolean) as [string, any][]
                ),
            };

            let url = `${sandbox_url}/dynamic/${api.endpoint}`;
            const method = api.method;

            const queryParams = new URLSearchParams(
                Object.fromEntries(
                    Object.entries(requestParams).filter(([key, _]) => {
                        // Assuming parameter type indicates if it's a query parameter
                        const param = parameters?.find(p => p.name === key);
                      
                        return param?.location === 'query';
                    })
                )
            ).toString();

            if (queryParams) {
                url += `?${queryParams}`;
            }
            
        const bodyParams = Object.fromEntries(
            Object.entries(requestParams).filter(([key, _]) => {
                const param = parameters?.find(p => p.name === key);
                return param?.location !== 'query';
            })
        );


            console.log('url', url)
            const response = await fetch(url, {
                method: method,
                headers: requestHeaders,
                body: method !== 'GET' && Object.keys(requestParams).length > 0
                    ? JSON.stringify(requestParams)
                    : undefined,
            });

            const responseBody = await response.json();
            setApiResponse({
                status: response.status.toString() as StatusCode, // Convert to string and cast to StatusCode
                response: responseBody,
                request: { url, method, headers: requestHeaders, params: requestParams },
            });

            setActiveTab('response');
        } catch (error) {
            setApiResponse({
                error: 'An error occurred during the request',
                details: error,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container mx-auto p-4 max-w-5xl">
            <Card className="mb-6">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Badge className={`${methodColors[api?.method as MethodType] || 'bg-gray-100'} font-mono`}>
                                    {api?.method}
                                </Badge>
                                <span>{api?.name}</span>
                            </CardTitle>
                            <CardDescription className="mt-1 text-sm font-mono">
                                {api?.endpoint}
                            </CardDescription>
                        </div>
                        <Button
                            onClick={makeRequest}
                            disabled={loading}
                            className="gap-2"
                            size="sm"
                        >
                            {loading ? 'Processing...' : 'Execute'} {!loading && <Play size={16} />}
                        </Button>
                    </div>
                    {api?.description && (
                        <div className="mt-2 text-sm text-gray-600">
                            {api.description}
                        </div>
                    )}
                </CardHeader>
            </Card>

            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'request' | 'response' | 'docs')} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="request" className="flex items-center gap-2">
                        <Settings size={16} /> Request
                    </TabsTrigger>
                    <TabsTrigger value="response" className="flex items-center gap-2">
                        <FileJson size={16} /> Response
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="flex items-center gap-2">
                        <Info size={16} /> Documentation
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="request" className="space-y-6">
                    {parameters && parameters.length > 0 && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-md">Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {parameters.map((param) => (
                                    <div key={param.api_parameter_id} className="grid grid-cols-3 items-center gap-4">
                                        <div>
                                            <div className="font-medium">{param.name}</div>
                                            {param.description && <div className="text-xs text-gray-500">{param.description}</div>}
                                        </div>
                                        <Input
                                            className="col-span-2"
                                            placeholder={param.expected_value || 'Enter value'}
                                            value={paramValues[param.name] || ''}
                                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {headers && headers.length > 0 && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-md">Headers</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {headers.map((header) => (
                                    <div key={header.header_id} className="grid grid-cols-3 items-center gap-4">
                                        <div>
                                            <div className="font-medium">{header.name}</div>
                                            {header.description && <div className="text-xs text-gray-500">{header.description}</div>}
                                        </div>
                                        <Input
                                            className="col-span-2"
                                            placeholder={header.expected_value || 'Enter value'}
                                            value={headerValues[header.name] || ''}
                                            onChange={(e) => handleHeaderChange(header.name, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end">
                        <Button onClick={makeRequest} disabled={loading} className="gap-2">
                            {loading ? 'Processing...' : 'Execute Request'} {!loading && <ArrowRight size={16} />}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="response">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-md">Response</CardTitle>
                                {apiResponse?.status && (
                                    <Badge className={`${statusColors[apiResponse.status] || 'bg-gray-100'}`}>
                                        {apiResponse.status}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!apiResponse ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Execute the request to see the response</p>
                                </div>
                            ) : apiResponse.error ? (
                                <div className="bg-red-50 p-4 rounded border border-red-200">
                                    <p className="text-red-700">{apiResponse.error}</p>
                                    <pre className="mt-2 text-xs overflow-auto p-2 bg-red-100 rounded">
                                        {JSON.stringify(apiResponse.details, null, 2)}
                                    </pre>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                            <Code size={16} /> Response Body
                                        </h4>
                                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                            <pre className="text-xs overflow-auto max-h-80">
                                                {JSON.stringify(apiResponse.response, null, 2)}
                                            </pre>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Request Details</h4>
                                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                            <pre className="text-xs overflow-auto max-h-60">
                                                {JSON.stringify(apiResponse.request, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="docs">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-md">API Documentation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium">Endpoint</h4>
                                <p className="text-sm mt-1 font-mono bg-gray-50 p-2 rounded">{api?.endpoint}</p>
                            </div>

                            {api?.description && (
                                <div>
                                    <h4 className="font-medium">Description</h4>
                                    <p className="text-sm mt-1">{api.description}</p>
                                </div>
                            )}

                            {responses && responses.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Response Codes</h4>
                                    <div className="space-y-2">
                                        {responses.map((response) => (
                                            <div key={response.resp_id} className="border rounded p-3">
                                                <div className="flex items-center mb-2">
                                                    <Badge className={`${statusColors[response.status_code as StatusCode] || 'bg-gray-100'}`}>
                                                        {response.status_code}
                                                    </Badge>
                                                    <span className="ml-2 text-sm">
                                                        {Number(response.status_code) >= 200 && Number(response.status_code) < 300 ? 'Success' : 'Error'}
                                                    </span>
                                                </div>
                                                <pre className="text-sm text-gray-600 bg-gray-100 p-4 rounded-md">
                                                    {response.response && typeof response.response === 'string'
                                                        ? JSON.stringify(JSON.parse(response.response), null, 2)
                                                        : JSON.stringify(response.response, null, 2)}
                                                </pre>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
};

export default ApiContainer;