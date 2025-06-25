import React from 'react';
import { api_endpoints } from '@/utils/api_constants';
import { ArrowRight, BadgeXIcon, CheckCircle, Code, FileJson, Globe, SendHorizonal } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QueryDocumentationContainer = () => {


    return (
        <div className="max-w-4xl w-full mx-auto p-6 bg-white border dark:bg-inherit rounded-lg shadow-md">
            {/* Header Section */}
            <div className="border-b pb-6 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <SendHorizonal className="text-indigo-600" size={24} />
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Query Transaction Status</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-300">This enables you query transaction status using a simple API call</p>
            </div>

            {/* Request Information */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="text-indigo-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Request</h2>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 mb-6 overflow-auto whitespace-pre-wrap break-words">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">GET</span>
                        <code className="text-sm font-mono bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">{`${api_endpoints.merchant.makeNameLookupRequest}/{transaction-ref}`}</code>
                    </div>
                </div>
            </div>

            {/* Headers Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Code className="text-indigo-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Request Headers</h2>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700 dark:text-white">Header</th>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700 dark:text-white">Value</th>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700 dark:text-white">Required</th>
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

                        </tbody>
                    </table>
                </div>
            </div>

            {/* Parameters Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Code className="text-indigo-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Request Parameters</h2>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700 dark:text-white">Parameter</th>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700 dark:text-white">Value</th>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700 dark:text-white">Required</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="py-2 px-4 font-mono">Transaction Ref</td>
                                <td className="py-2 px-4">Your Transaction Reference</td>
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
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Example Request Body</h2>
                </div>
                <p>No Request Body</p>
            </div>

            {/* Response Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <ArrowRight className="text-indigo-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Expected Responses</h2>
                </div>

                {/* 200 Success Response */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-green-500" size={16} />
                        <h3 className="text-md font-semibold text-gray-800 dark:text-white">200 - Success</h3>
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
                                "code": 200,
                                "data": {
                                    "amount": "1",
                                    "channel": "airtel",
                                    "customer": "260978129089",
                                    "date": "0001-01-01T00:00:00Z",
                                    "status": "pending"
                                },
                                "message": "Transaction Status Retrieved",
                                "status": "success"
                            }, null, 2)}
                    </SyntaxHighlighter>
                </div>

                {/* 202 Pending Response */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BadgeXIcon className="text-red-500" size={16} />
                        <h3 className="text-md font-semibold text-gray-800 dark:text-white">404 - Not Found</h3>
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
                            "code": 404,
                            "error": {
                                "Transaction Reference": [
                                    "Transaction Reference is invalid"
                                ]
                            },
                            "message": "Transaction Not Found",
                            "status": "failed"
                        }, null, 2)}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
};

export default QueryDocumentationContainer;