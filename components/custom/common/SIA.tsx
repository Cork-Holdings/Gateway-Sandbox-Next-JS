import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideCheckCircle } from "lucide-react";

const SIA = () => {
  return (
    <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">See It In Action</h2>
              <p className="text-lg text-gray-600 mb-8">
                Try our interactive demo to see how easy it is to integrate with our payment gateway. No signup required.
              </p>
              
              <Tabs defaultValue="curl" className="w-full max-w-md">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="node">Node.js</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                <TabsContent value="curl" className="p-4 bg-gray-900 text-white rounded-md mt-2 overflow-x-auto">
                  <pre className="text-sm">
                    {`curl -X POST https://api.sandbox.payment.com/v1/charges \\
  -H "Authorization: Bearer sk_sandbox_123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2000,
    "currency": "usd",
    "source": "tok_visa",
    "description": "Test charge"
  }'`}
                  </pre>
                </TabsContent>
                <TabsContent value="node" className="p-4 bg-gray-900 text-white rounded-md mt-2 overflow-x-auto">
                  <pre className="text-sm">
                    {`const paymentAPI = require('payment-api');
const client = new paymentAPI('sk_sandbox_123');

const charge = await client.charges.create({
  amount: 2000,
  currency: 'usd',
  source: 'tok_visa',
  description: 'Test charge'
});`}
                  </pre>
                </TabsContent>
                <TabsContent value="python" className="p-4 bg-gray-900 text-white rounded-md mt-2 overflow-x-auto">
                  <pre className="text-sm">
                    {`import payment_api

client = payment_api.Client("sk_sandbox_123")

charge = client.charges.create(
    amount=2000,
    currency="usd",
    source="tok_visa",
    description="Test charge"
)`}
                  </pre>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="flex-1 relative">
              <div className="relative bg-white shadow-xl rounded-lg p-6 border border-gray-200 max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-gray-100 rounded px-3 py-1 text-sm">api.sandbox.payment.com</div>
                </div>
                <div className="space-y-4">
                  <div className="animate-pulse bg-gray-100 h-8 rounded w-3/4"></div>
                  <div className="animate-pulse bg-gray-100 h-32 rounded"></div>
                  <div className="flex justify-end">
                    <div className="animate-pulse bg-blue-100 h-10 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-green-500 text-white rounded-full p-2 shadow-lg">
                  <LucideCheckCircle className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  )
}

export default SIA