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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DownloadIcon,
  FileTextIcon,
  RefreshCcwIcon,
  FilterIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from "lucide-react";
import { api_endpoints } from '@/utils/api_constants';
import { useSession } from 'next-auth/react';
import { TransactionChannels, TransactionStatistics } from '@/utils/types/Dashboard';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Transaction } from '@/utils/types/Filters';

const TransactionsTab = () => {
  const [cardData, setCardData] = useState<TransactionStatistics | null>(null);
  const [transactionChannelData, setTransactionChannelData] = useState<TransactionChannels | null>(null);
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);

  const fetchTransactionChannels = async () => {
    try {
      const response = await fetch(api_endpoints.backoffice.getTransactionChannels, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
      });

      const responseBody = await response.json();
      if (responseBody.status === "success" && responseBody?.info) {
        setTransactionChannelData(responseBody.info);
      }
    } catch (error) {
      console.error("Error fetching transaction channels:", error);
    }
  };

  const fetchTransactionStats = async () => {
    try {
      const response = await fetch(api_endpoints.backoffice.getTransactionStats, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
      });

      const responseBody = await response.json();
      if (responseBody.status === "success" && responseBody?.info) {
        setCardData(responseBody.info);
      } else if (responseBody["status"] == "failure") {
        toast.error(responseBody["error"])
      }
    } catch (error) {
      console.error("Error fetching transaction stats:", error);
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const body = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
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

      if (responseBody.status === "success" && responseBody?.data?.transactions) {
        const transactions = responseBody.data.transactions.map((transaction: Transaction) => ({
          id: transaction.id,
          reference: transaction.reference,
          amount: transaction.amount,
          channel: transaction.channel,
          type: transaction.type,
          status: transaction.status,
          narration: transaction.narration,
          date: format(transaction.date, "MMMM dd, yyyy"),
          customer: transaction.customer,
        }));
        setTransactionData(transactions);
        setTotalPages(responseBody.data.total_pages || responseBody.data.totalPages || 0);
      }
      else if (responseBody["status"] == "failure") {
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
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchTransactions(),
          fetchTransactionChannels(),
          fetchTransactionStats()
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.accessToken) {
      loadData();
    }
  }, [pagination.pageIndex, pagination.pageSize, session?.accessToken]);

  const calculateChannelPercentages = (channels: TransactionChannels) => {
    const total = Object.values(channels).reduce((sum, val) => sum + val, 0);
    return {
      mtn: total ? ((channels.mtn ?? 0) / total) * 100 : 0,
      airtel: total ? ((channels.airtel ?? 0) / total) * 100 : 0,
      zamtel: total ? ((channels.zamtel ?? 0) / total) * 100 : 0,
    };
  };

  const channelPercentages = transactionChannelData
    ? calculateChannelPercentages(transactionChannelData)
    : { mtn: 0, airtel: 0, zamtel: 0 };

  const refreshData = () => {
    fetchTransactions();
    fetchTransactionStats();
    fetchTransactionChannels();
  };

  const getStatusBadgeStyle = (status: string) => {
    status = status.toLowerCase();

    if (status === "successful" || status === "completed") {
      return "bg-green-100 text-green-700  capitalize ";
    } else if (status === "failed") {
      return "bg-red-100 text-red-700  capitalize ";
    }
    return "bg-amber-100 text-amber-700  capitalize";
  };

  const totalFailed = cardData
    ? (((cardData.failed ?? 0) / (cardData.transactions ?? 0)) * 100).toFixed(1)
    : 0;


  const totalSuccessful = cardData
    ? (((cardData.successful ?? 0) / (cardData.transactions ?? 0)) * 100).toFixed(1)
    : 0;

  return (
    <main className="flex flex-col gap-6">
      {/* Summary Cards Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transaction Dashboard</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          className="flex items-center gap-2"
        >
          <RefreshCcwIcon size={16} />
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm dark:bg-[#272727]">
          <CardHeader className="pb-2">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-3xl font-bold">{cardData?.transactions ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-muted-foreground text-sm">
              All transaction activities
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-green-50 dark:bg-[#272727]">
          <CardHeader className="pb-2">
            <CardDescription>Successful</CardDescription>
            <CardTitle className="text-3xl font-bold text-green-600">{cardData?.successful ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-muted-foreground text-sm">
              {cardData?.transactions ? `${totalSuccessful}%` : '0%'} of total
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-red-50 dark:bg-[#272727]">
          <CardHeader className="pb-2">
            <CardDescription>Failed</CardDescription>
            <CardTitle className="text-3xl font-bold text-red-600">{cardData?.failed ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-muted-foreground text-sm">
              {cardData?.transactions ? `${totalFailed}%` : '0%'} of total
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-amber-50 dark:bg-[#272727]">
          <CardHeader className="pb-2">
            <CardDescription>Total Amount</CardDescription>
            <CardTitle className="text-3xl font-bold">K{cardData?.totalAmount?.toLocaleString() ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-muted-foreground text-sm">
              Processed value
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics and Actions Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle>Transaction Channels</CardTitle>
            <CardDescription>Distribution by payment provider</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>MTN Mobile Money</span>
                  </div>
                  <span className="font-medium">{channelPercentages.mtn.toFixed(1)}%</span>
                </div>
                <Progress
                  indicatorColor="bg-yellow-500"
                  value={channelPercentages.mtn} className="h-2 bg-gray-100" />
                <div className="text-xs text-muted-foreground">{transactionChannelData?.mtn ?? 0} transactions</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Airtel Money</span>
                  </div>
                  <span className="font-medium">{channelPercentages.airtel.toFixed(1)}%</span>
                </div>
                <Progress
                  indicatorColor="bg-red-500"
                  value={channelPercentages.airtel} className="h-2 bg-gray-100" />
                <div className="text-xs text-muted-foreground">{transactionChannelData?.airtel ?? 0} transactions</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Zamtel Kwacha</span>
                  </div>
                  <span className="font-medium">{channelPercentages.zamtel.toFixed(1)}%</span>
                </div>
                <Progress
                  indicatorColor="bg-green-500"
                  value={channelPercentages.zamtel} className="h-2 bg-gray-100" />
                <div className="text-xs text-muted-foreground">{transactionChannelData?.zamtel ?? 0} transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage transaction tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
              <FilterIcon size={16} />
              View Failed Transactions
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
              <FilterIcon size={16} />
              View Pending Transactions
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileTextIcon size={16} />
              Generate Report
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <DownloadIcon size={16} />
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table Section */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Showing transaction activity for the current period</CardDescription>
          </div>
          <div className="flex gap-2">

            <Button variant="outline" size="sm">
              <DownloadIcon size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
                    <TableHead>Channel</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionData.length > 0 ? (
                    transactionData.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-gray-50 dark:hover:bg-[#272727]">
                        <TableCell className="font-medium">{tx.reference}</TableCell>
                        <TableCell>K{tx.amount}</TableCell>
                        <TableCell className=''>
                          <Badge variant="outline" className={`capitalize ${getStatusBadgeStyle(tx.status)}`}>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1).toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{tx.customer}</TableCell>
                        <TableCell>{tx.channel}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
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
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: Math.max(prev.pageIndex - 1, 0) }))}
              disabled={pagination.pageIndex === 0 || isLoading}
            >
              <ArrowLeftIcon size={16} className="mr-2" />
              Previous
            </Button>
            <div className="text-sm">
              Page {pagination.pageIndex + 1} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
              disabled={pagination.pageIndex + 1 >= totalPages || isLoading}
            >
              Next
              <ArrowRightIcon size={16} className="ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};

export default TransactionsTab;