"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';
import { 
  CreditCard, 
  Send, 
  Key, 
  ArrowRight,
  LayoutDashboard, 
  RefreshCcw,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const apis = [
  {
    id: "1",
    name: "Collection",
    description: "Process payments through the Payment Gateway collection endpoint",
    icon: CreditCard,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "2",
    name: "Disbursement",
    description: "Handle payouts using the Payment Gateway disbursement API",
    icon: Send,
    color: "bg-green-100 text-green-600"
  },
  {
    id: "3",
    name: "Authorization",
    description: "Manage authentication with the Authorization API",
    icon: Key,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: "4",
    name: "Transaction Status",
    description: "Check Transaction Status with the Status API",
    icon: RefreshCcw,
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: "5",
    name: "Name Look Up",
    description: "Manage KYC with the Name look up API",
    icon: User,
    color: "bg-cyan-100 text-cyan-600"
  },
  
];

const APIPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">API Dashboard</h1>
        </div>
        <p className="text-sm text-gray-500">
          Explore available API endpoints
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Section */}
          <section className="mb-10 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Payment Gateway API Suite
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover and test our powerful API endpoints for payment processing,
              disbursements, and authentication.
            </p>
          </section>

          {/* API Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apis.map((api) => (
              <Link key={api.id} href={`/merchant/apis/${api.id}`} className="group">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${api.color}`}>
                        <api.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {api.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      {api.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-blue-50"
                    >
                      Test Endpoint
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Payment Gateway API. All rights reserved.
      </footer>
    </div>
  );
};

export default APIPage;