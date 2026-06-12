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
  Settings2,
  ScreenShare,
  Smartphone
} from 'lucide-react';
import TransactionStatusContainer from '@/components/custom/containers/transaction-status-container';
import NameLookupContainer from '@/components/custom/containers/name-lookup-container';
import CheckoutSessionContainer from '@/components/custom/containers/checkout_session_container';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import toast from 'react-hot-toast';
import { api_endpoints } from '@/utils/api_constants';
import { signOut, useSession } from 'next-auth/react';
import CardContainer from '@/components/custom/containers/card-container';

const ExecuteAPI = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const endpoints = [
    { id: "1", name: "Authorization", icon: Key, component: AuthorizeContainer, },

    { id: "2", name: "Collection", icon: Smartphone, component: CollectionContainer, },
    { id: "3", name: "Disbursement", icon: Send, component: DisbursementContainer, },
    { id: "4", name: "Transaction Status", icon: RefreshCcw, component: TransactionStatusContainer, },
    { id: "5", name: "Name Look Up", icon: User, component: NameLookupContainer, },
    { id: "6", name: "Hosted Checkout", icon: ScreenShare, component: CheckoutSessionContainer, },
    // { id: "7", name: "Card Simulation", icon: CreditCard, component: CardContainer, },
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

  const [clientID, setClientID] = useState<string>('')
  const [clientSecret, setClientSecret] = useState<string>('')
  const [clientSignature, setClientSignature] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [float, setFloat] = useState<string>('')

  const { data: session, } = useSession();

  const fetchAPIcreds = async () => {
    setLoading(true);

    try {

      const url = `${api_endpoints.common.getAPIcredentials}/${session?.id}`


      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${session?.accessToken}`
        }
      })

      const data = await response.json()

      if (response.status == 401) {
        signOut({ callbackUrl: "/auth/signin/admin" })
      }

      if (data.status == "success") {
        setClientID(data.credentials.clientID)
        setClientSecret(data.credentials.clientSecret)
        setClientSignature(data.credentials.clientSignature)
        setFloat(data.credentials.float_balance)

      }

      else if (data.status == "failure") {
        toast.error(`Unable to fetch client credentials\n${data.detail}`)
      }

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      toast.error("Something went wrong.Try Again.")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    if (session?.id) {
      fetchAPIcreds();
    }
  }, [session?.id]); // Now it depends on session.id, and only runs when it changes.


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-inherit flex flex-col">
      {/* Header */}
      <header className="hidden bg-white dark:bg-inherit shadow-sm p-4  md:flex items-center justify-between mb-10 rounded-2xl">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">API Execution Dashboard</h1>
        </div>

        <Sheet>
          <SheetTrigger className='text-sm flex items-center gap-2'> View Credentials <Settings2 className='h-4 w-4' /> </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className='font-semibold'>Credentials</SheetTitle>
              <SheetDescription>
                <div className="pt-6 space-y-6">
                  {/* Client ID */}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Client ID</p>
                    <p className="text-base font-mono text-gray-900 break-all">{clientID}</p>
                  </div>

                  {/* Client Secret */}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Client Secret</p>
                    <p className="text-base font-mono text-gray-900 break-all">{clientSecret}</p>
                  </div>

                  {/* Client Signature */}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Client Signature</p>
                    <p className="text-base font-mono text-gray-900 break-all">{clientSignature}</p>
                  </div>
                </div>
              </SheetDescription>

            </SheetHeader>
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`z-30 md:z-0 bg-white dark:bg-gray-900 rounded-2xl shadow-md transition-all duration-300 h-fit
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