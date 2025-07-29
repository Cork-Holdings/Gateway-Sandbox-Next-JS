import React from 'react';
import { api_endpoints, next_url } from '@/utils/api_constants';
import { ArrowRight, BadgeXIcon, CheckCircle, Code, FileJson, Globe, SendHorizonal } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CheckoutSessionDocumentationContainer = () => {
    return (
        <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Header Section */}
            <div className="border-b pb-6 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <SendHorizonal className="text-indigo-600" size={24} />
                    <h1 className="text-2xl font-bold text-gray-800">Create Checkout URL</h1>
                </div>
                <p className="text-gray-600">This enables you to create a hosted checkout endpoint</p>
            </div>

            {/* Request Information */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="text-indigo-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800">Request</h2>
                </div>

                <div className="bg-gray-50 rounded-md p-4 mb-6 overflow-auto whitespace-pre-wrap break-words">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded">POST</span>
                        <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">{`${api_endpoints.merchant.makeAddCheckoutRequest}`}</code>
                    </div>
                </div>
            </div>

            {/* Headers Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Code className="text-indigo-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800">Request Headers</h2>
                </div>

                <div className="bg-gray-50 rounded-md p-4 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700">Header</th>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700">Value</th>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700">Required</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="py-2 px-4 font-mono">Content-Type</td>
                                <td className="py-2 px-4">application/json</td>
                                <td className="py-2 px-4">true</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 font-mono">Accept</td>
                                <td className="py-2 px-4">application/json</td>
                                <td className="py-2 px-4">true</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 font-mono">Authorization</td>
                                <td className="py-2 px-4">Your Bearer Token</td>
                                <td className="py-2 px-4">true</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 font-mono">X-Client-ID</td>
                                <td className="py-2 px-4">Your Client ID</td>
                                <td className="py-2 px-4">true</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Body Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <FileJson className="text-indigo-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800">Example Request Body</h2>
                </div>



                <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        maxHeight: '400px',
                        overflow: 'auto'
                    }}
                >
                    {JSON.stringify({
                        "order_id": "ORD123",
                        "amount": "K150",
                        "customer_name": "John Doe",
                        "customer_email": "jd@example.com",
                        "return_url": "https://www.success.com/",
                       
                    }, null, 2)}
                </SyntaxHighlighter>
            </div>


            {/* Response Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <ArrowRight className="text-indigo-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800">Expected Responses</h2>
                </div>

                {/* 200 Success Response */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-green-500" size={16} />
                        <h3 className="text-md font-semibold text-gray-800">200 - Success</h3>
                    </div>

                    <SyntaxHighlighter
                        language="json"
                        style={vscDarkPlus}
                        customStyle={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            maxHeight: '400px',
                            overflow: 'auto'
                        }}
                    >
                        {JSON.stringify({
                            "checkout_url": `https://${next_url}/merchant/hosted-checkout/ff466c58-258b-4428-9beb-d81f6c8d7532`,
                            "message": "Checkout session created",
                            "status": "success"
                        }, null, 2)}
                    </SyntaxHighlighter>
                </div>

                {/* 202 Pending Response */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BadgeXIcon className="text-red-500" size={16} />
                        <h3 className="text-md font-semibold text-gray-800">400 - Invalid Phone Number</h3>
                    </div>


                    <SyntaxHighlighter
                        language="json"
                        style={vscDarkPlus}
                        customStyle={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            maxHeight: '400px',
                            overflow: 'auto'
                        }}
                    >
                        {JSON.stringify({
                            "code": 400,
                            "errors": {
                                "phone_number": [
                                    "Invalid Phone number"
                                ]
                            },
                            "message": "Validation failed.",
                            "status": "error"
                        }, null, 2)}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSessionDocumentationContainer;