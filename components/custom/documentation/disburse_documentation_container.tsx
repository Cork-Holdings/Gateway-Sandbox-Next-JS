import React from 'react';
import { api_endpoints } from '@/utils/api_constants';
import { ArrowRight, BadgeXIcon, CheckCircle, Code, FileJson, Globe, SendHorizonal } from 'lucide-react';

const DisbursementAPIDocumentationContainer = () => {
    return (
        <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Header Section */}
            <div className="border-b pb-6 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <SendHorizonal className="text-indigo-600" size={24} />
                    <h1 className="text-2xl font-bold text-gray-800">Intiate Disbursement</h1>
                </div>
                <p className="text-gray-600">This enables you disburse money to a given number </p>
            </div>

            {/* Request Information */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="text-indigo-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800">Request</h2>
                </div>

                <div className="bg-gray-50 rounded-md p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded">POST</span>
                        <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">{`${api_endpoints.merchant.makeDisburseRequest}`}</code>
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
                            <tr>
                                <td className="py-2 px-4 font-mono">X-Auth-Signature</td>
                                <td className="py-2 px-4">Your OAuth Signature</td>
                                <td className="py-2 px-4">true</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 font-mono">X-Callback-URL</td>
                                <td className="py-2 px-4">Your Callback URL</td>
                                <td className="py-2 px-4">false</td>
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

                <div className="bg-gray-900 text-white rounded-md p-4 font-mono text-sm">
                    <pre>{JSON.stringify({
                        phone_number: "260961234567",
                        amount: 10,
                        narration: "test narration"
                    }, null, 2)}</pre>
                </div>
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
                    <div className="bg-gray-900 text-white rounded-md p-4 font-mono text-sm">
                        <pre>
                            {JSON.stringify({
                                "code": 200,
                                "data": {
                                    "external_id": "8445203466",
                                    "transaction_id": "testing-dis-ref"
                                },
                                "message": "Funds disbursed",
                                "status": "successful"
                            }, null, 2)}
                        </pre>
                    </div>
                </div>

                {/* 202 Pending Response */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BadgeXIcon className="text-red-500" size={16} />
                        <h3 className="text-md font-semibold text-gray-800">400 - Invalid Phone Number</h3>
                    </div>
                    <div className="bg-gray-900 text-white rounded-md p-4 font-mono text-sm">
                        <pre>
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
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisbursementAPIDocumentationContainer;