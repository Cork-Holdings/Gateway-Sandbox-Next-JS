"use client"
import AuthorizeContainer from '@/components/custom/containers/authorize-container';
import CollectionContainer from '@/components/custom/containers/collection-container';
import DisbursementContainer from '@/components/custom/containers/disbursement-container';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  LayoutDashboard,
  CreditCard,
  Send,
  Key,
  ChevronLeft,
  ChevronRight,
  User,
  RefreshCcw,
  ScreenShare
} from 'lucide-react';
import TransactionStatusContainer from '@/components/custom/containers/transaction-status-container';
import NameLookupContainer from '@/components/custom/containers/name-lookup-container';
import CheckoutSessionContainer from '@/components/custom/containers/checkout_session_container';

const ExecuteAPI = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const endpoints = [
    { id: "1", name: "Collection", icon: CreditCard, component: CollectionContainer, },
    { id: "2", name: "Disbursement", icon: Send, component: DisbursementContainer, },
    { id: "3", name: "Authorization", icon: Key, component: AuthorizeContainer,},
    { id: "4", name: "Transaction Status", icon: RefreshCcw, component: TransactionStatusContainer, },
    { id: "5", name: "Name Look Up", icon: User, component: NameLookupContainer,  },
    { id: "6", name: "Hosted Checkout", icon: ScreenShare, component: CheckoutSessionContainer,  },
  ];

  const selectedEndpoint = endpoints.find(endpoint => endpoint.id === id);
  const SelectedComponent = selectedEndpoint?.component;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // Tailwind lg breakpoint is 1024px
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
  
    handleResize(); // Set initial state on load
    window.addEventListener('resize', handleResize);
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-inherit flex flex-col">
      {/* Header */}
      <header className="hidden bg-white dark:bg-inherit shadow-sm p-4  md:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">API Execution Dashboard</h1>
        </div>
        <div className="text-sm text-gray-500">
          Current Date: {new Date().toLocaleDateString()}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`z-30 md:z-0 bg-white dark:bg-gray-900 rounded-2xl shadow-md transition-all duration-300
            ${isSidebarOpen ? 'w-64' : 'w-16'}
            
               'relative md:absolute'}
          `}
        >
          <div className="p-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-blue-600"
            >
              {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>

          <nav className="space-y-2 p-2">
            {endpoints.map(endpoint => (
              <Button
                key={endpoint.id}
                variant={id === endpoint.id ? "default" : "ghost"}
                className={`w-full justify-start gap-2 ${!isSidebarOpen && 'justify-center'
                  }`}
                onClick={() => router.push(`/merchant/apis/${endpoint.id}`)}
              >
                <endpoint.icon className="h-5 w-5" />
                {isSidebarOpen && <span>{endpoint.name}</span>}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {SelectedComponent ? (
            <div>

              <SelectedComponent />
            </div>

          ) : (
            <Card className="max-w-2xl mx-auto mt-10">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Welcome to API Execution Dashboard
                </h2>
                <p className="text-gray-500">
                  Please select an endpoint from the sidebar to begin testing
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-inherit border-t p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} API Execution Sandbox. All rights reserved.
      </footer>
    </div>

  );
};

export default ExecuteAPI;