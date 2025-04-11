import React from 'react';
import { api_endpoints } from '@/utils/api_constants';
import { ArrowRight, BadgeXIcon, CheckCircle, Code, FileJson, Globe, SendHorizonal } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const NameLookupDocumentationContainer = () => {
    return (
        <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Header Section */}
            <div className="border-b pb-6 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <SendHorizonal className="text-indigo-600" size={24} />
                    <h1 className="text-2xl font-bold text-gray-800">Name Lookup</h1>
                </div>
                <p className="text-gray-600">This enables you query user names using a simple API call</p>
            </div>

            {/* Request Information */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="text-indigo-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800">Request</h2>
                </div>

                <div className="bg-gray-50 rounded-md p-4 mb-6 overflow-auto whitespace-pre-wrap break-words">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">GET</span>
                        <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">{`${api_endpoints.merchant.makeNameLookupRequest}/{phone_number}`}</code>
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

                        </tbody>
                    </table>
                </div>
            </div>

            {/* Parameters Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Code className="text-indigo-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800">Request Parameters</h2>
                </div>

                <div className="bg-gray-50 rounded-md p-4 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700">Parameter</th>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700">Value</th>
                                <th className="text-left py-2 px-4 font-semibold text-gray-700">Required</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="py-2 px-4 font-mono">Phone number</td>
                                <td className="py-2 px-4">A valid phone number</td>
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
                <p className='font-semibold'>No Request Body</p>
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
                            "code": 200,
                            "status": "success",
                            "message": "Name lookup completed successfully.",
                            "data": {
                                "status": "success",
                                "provider": "MTN",
                                "phone_number": "260765631424",
                                "names": "John MTN Doe"
                            }
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

export default NameLookupDocumentationContainer;