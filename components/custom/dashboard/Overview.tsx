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
  Search
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OverViewCard, } from '@/utils/types/Dashboard';
import { api_endpoints } from '@/utils/api_constants';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Transaction } from '@/utils/types/Filters';
import { GetTransactions } from '@/utils/api/transaction';
import { NamelessDataTable } from '../datatables/nameless-datatable';
import { TransactionColumns } from '@/app/(app)/merchant/(routes)/dashboard/transaction-columns';


const Overview = () => {
  const [cardData, setCardData] = useState<OverViewCard | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)




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
      } else if (responseBody["status"] == "failure") {
        toast.error(responseBody["error"])
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      // setError(null)

      const { transactions, total_pages, current_page, has_more, count, pending, successful, failed } = await GetTransactions({
        user_id: "",
        token: session?.accessToken!,
        page: page,
        page_size: pageSize,
        transaction_reference: "",
        customer: "",
        external_reference: "",
        transaction_type: "",
        channel: "",
        status: "",
        start_date: "",
        end_date: "",
      })

      if (transactions) {
        setTransactions(transactions)
        setTotalPages(total_pages)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    if (session?.accessToken) {
      fetchOverviewCardInfo();
      loadTransactions();
    }
  }, [session, page, pageSize]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (session?.accessToken) {
        loadTransactions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <div className='border-l-4 border border-l-blue-500 rounded-2xl p-4 h-fit flex items-center justify-between gap-2'>
          <div className=''>
            <p>Total Users</p>
            <div className="text-3xl font-bold">{isLoading ? "..." : cardData?.users || 0}</div>
          </div>

          <div className="rounded-full bg-blue-100 p-2">
            <Users className="h-4 w-4 text-blue-500" />
          </div>

        </div>


        <div className='border-l-4 border border-l-emerald-500 rounded-2xl p-4 h-fit flex items-center justify-between gap-2'>
          <div className=''>
            <p>Total Merchants</p>
            <div className="text-3xl font-bold">{isLoading ? "..." : cardData?.merchants || 0}</div>
          </div>

          <div className="rounded-full bg-emerald-100 p-2">
            <Store className="h-4 w-4 text-emerald-500" />
          </div>

        </div>


        <div className='border-l-4 border border-l-purple-500 rounded-2xl p-4 h-fit flex items-center justify-between gap-2'>
          <div className=''>
            <p>Total API Requests</p>
            <div className="text-3xl font-bold">{isLoading ? "..." : cardData?.api_requests || 0}</div>
          </div>

          <div className="rounded-full bg-purple-100 p-2">
            <Activity className="h-4 w-4 text-purple-500" />
          </div>

        </div>

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
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 p-3 mb-3">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="rounded-md border">

              <NamelessDataTable
                data={transactions}
                columns={TransactionColumns()}
                pageIndex={page - 1}
                pageSize={pageSize}
                totalPages={totalPages}
                onPaginationChange={(pageIdx, sz) => {
                  setPage(pageIdx + 1)
                  setPageSize(sz)
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default Overview;