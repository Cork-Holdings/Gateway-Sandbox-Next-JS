"use client"
import React, { useEffect, useState } from 'react'
import { api_endpoints } from '@/utils/api_constants'
import { useSession } from 'next-auth/react'
import { Loader2, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Transaction {
  id: string
  reference: string
  amount: string
  status: string
  customer: string
  channel: string
  type: string
  narration: string
  date: string
}

const DashboardPage = () => {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(api_endpoints.backoffice.getTransactions, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({
          page: 1,
          pageSize: 20
        })
      })

      const data = await response.json()
      if (data.status === "success" && data.response?.transactions) {
        setTransactions(data.response.transactions)
      } else {
        setTransactions([])
      }
    } catch (err) {
      console.error(err)
      setError("Failed to retrieve transactions.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session?.accessToken) {
      fetchTransactions()
    }
  }, [session])

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'successful':
      case 'success':
      case 'completed':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-2 py-0.5 rounded-full">Successful</Badge>
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-2 py-0.5 rounded-full">Pending</Badge>
      case 'failed':
        return <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-2 py-0.5 rounded-full">Failed</Badge>
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-2 py-0.5 rounded-full">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your merchant account transactions.</p>
        </div>
        <Button 
          onClick={fetchTransactions} 
          variant="outline" 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <CardTitle className="text-xl font-bold dark:text-white">Transaction History</CardTitle>
          <CardDescription className="dark:text-gray-400">Showing recent mobile money collection and checkout transactions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
              <p className="mt-4 text-gray-600 font-medium dark:text-gray-400">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-rose-500 font-medium">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="py-20 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg font-semibold">No transactions found</p>
              <p className="text-sm mt-1">Transactions will appear here once processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Reference</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Channel</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Amount</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                      <TableCell className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        {tx.date ? new Date(tx.date).toLocaleString() : 'N/A'}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-800 dark:text-gray-200">
                        {tx.reference}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200 font-medium">
                        {tx.customer}
                      </TableCell>
                      <TableCell className="uppercase text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {tx.channel}
                      </TableCell>
                      <TableCell className="font-bold text-gray-900 dark:text-white">
                        {tx.amount} ZMW
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tx.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage