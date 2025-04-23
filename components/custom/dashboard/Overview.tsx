"use client"
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Activity,
  Users,
  Store,
  Search} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OverViewCard, Transaction } from '@/utils/types/Dashboard';
import { api_endpoints } from '@/utils/api_constants';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';


const Overview = () => {
  const [cardData, setCardData] = useState<OverViewCard | null>(null)
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);

  const fetchOverviewCardInfo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(api_endpoints.backoffice.getOverviewInfo, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
      });

      const responseBody = await response.json();

      if (responseBody.status === "success" && responseBody?.info) {
        setCardData(responseBody.info);
      }   else if (responseBody["status"] == "failure") {
        toast.error(responseBody["error"])
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const body = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined
      };

      const response = await fetch(api_endpoints.backoffice.getTransactions, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(body),
      });

      const responseBody = await response.json();

      if (responseBody.status === "success" && responseBody?.transactions?.transaction) {
        const transactions = responseBody.transactions.transaction.map((transaction: Transaction) => ({
          id: transaction.id,
          reference: transaction.reference,
          amount: transaction.amount,
          channel: transaction.channel,
          type: transaction.type,
          status: transaction.status,
          narration: transaction.narration,
          date: format(new Date(transaction.date), "MMMM dd, yyyy"),
          customer: transaction.customer,
        }));
        setTransactionData(transactions);
        setTotalPages(responseBody.transactions.totalPages || 0);
      }   else if (responseBody["status"] == "failure") {
        toast.error(responseBody["error"])
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchOverviewCardInfo();
      fetchTransactions();
    }
  }, [session, pagination.pageIndex, pagination.pageSize]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (session?.accessToken) {
        fetchTransactions();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus]);

  const getStatusStyle = (status: string) => {
    if (status === "successful" || status === "completed") {
      return "bg-green-100 text-green-700";
    } else if (status === "failed") {
      return "bg-red-100 text-red-700";
    } else {
      return "bg-amber-100 text-amber-700";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <main className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button size="sm">Refresh</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="rounded-full bg-blue-100 p-2">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "..." : cardData?.users || 0}</div>
         
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Merchants</CardTitle>
            <div className="rounded-full bg-emerald-100 p-2">
              <Store className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "..." : cardData?.merchants || 0}</div>
            
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <div className="rounded-full bg-purple-100 p-2">
              <Activity className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "..." : cardData?.api_requests || 0}</div>
           
          </CardContent>
        </Card>
        
      </div>

      <Card className="mt-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Showing recent transaction activity</CardDescription>
            </div>
            </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : transactionData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 p-3 mb-3">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionData.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{tx.reference}</TableCell>
                      <TableCell>{formatCurrency(Number(tx.amount))}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusStyle(tx.status)}`}>
                          {tx.status}
                        </span>
                      </TableCell>
                      <TableCell>{tx.customer}</TableCell>
                      <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {transactionData.length} of {totalPages * pagination.pageSize} transactions
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({...prev, pageIndex: Math.max(prev.pageIndex - 1, 0)}))}
              disabled={pagination.pageIndex === 0 || isLoading}
            >
              Previous
            </Button>
            <div className="text-sm">
              Page {pagination.pageIndex + 1} of {totalPages || 1}
            </div>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => setPagination((prev) => ({...prev, pageIndex: prev.pageIndex + 1}))}
              disabled={pagination.pageIndex + 1 >= totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Overview;