"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CheckCircle2, Clock, DollarSign, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { NamelessDataTable } from '@/components/custom/datatables/nameless-datatable'
import { TransactionColumns } from './transaction-columns'
import { GetTransactions } from '@/utils/api/transaction'
import { Transaction } from '@/utils/types/Filters'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'


const DashboardPage = () => {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [transactionReference, setTransactionReference] = useState<string>("")
  const [customer, setCustomer] = useState<string>("")
  const [externalReference, setExternalReference] = useState<string>("")
  const [transactionType, setTransactionType] = useState<string>("")
  const [channel, setChannel] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [totalTransactions, setTotalTransactions] = useState<number>(0)
  const [totalSuccessful, setTotalSuccessful] = useState<number>(0)
  const [totalFailed, setTotalFailed] = useState<number>(0)
  const [totalPending, setTotalPending] = useState<number>(0)

  const loadTransactions = async (overrides?: {
    page?: number
    page_size?: number
    transaction_reference?: string
    customer?: string
    external_reference?: string
    transaction_type?: string
    channel?: string
    status?: string
    start_date?: string
    end_date?: string
  }) => {

    if (!session?.id) return
    try {
      setIsLoading(true)
      setError(null)

      const activePage = overrides && 'page' in overrides ? overrides.page : page
      const activePageSize = overrides && 'page_size' in overrides ? overrides.page_size : pageSize

      const { transactions, total_pages, current_page, has_more, count, pending, successful, failed } = await GetTransactions({
        user_id: session.id,
        token: session.accessToken ?? "",
        page: activePage,
        page_size: activePageSize,
        transaction_reference: overrides && 'transaction_reference' in overrides ? overrides.transaction_reference! : transactionReference,
        customer: overrides && 'customer' in overrides ? overrides.customer! : customer,
        external_reference: overrides && 'external_reference' in overrides ? overrides.external_reference! : externalReference,
        transaction_type: overrides && 'transaction_type' in overrides ? overrides.transaction_type! : transactionType,
        channel: overrides && 'channel' in overrides ? overrides.channel! : channel,
        status: overrides && 'status' in overrides ? overrides.status! : status,
        start_date: overrides && 'start_date' in overrides ? overrides.start_date! : startDate,
        end_date: overrides && 'end_date' in overrides ? overrides.end_date! : endDate,
      })

      if (transactions) {
        setTransactions(transactions)
        setTotalTransactions(count)
        setTotalSuccessful(successful)
        setTotalFailed(failed)
        setTotalPending(pending)
        setTotalPages(total_pages)
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
      loadTransactions()
    }
  }, [session?.accessToken, page, pageSize])

  const handleFilter = () => {
    setPage(1)
    loadTransactions({ page: 1 })
  }

  const handleClear = () => {
    setTransactionReference("")
    setCustomer("")
    setExternalReference("")
    setTransactionType("")
    setChannel("")
    setStatus("")
    setStartDate("")
    setEndDate("")
    setPage(1)
    loadTransactions({
      page: 1,
      transaction_reference: "",
      customer: "",
      external_reference: "",
      transaction_type: "",
      channel: "",
      status: "",
      start_date: "",
      end_date: "",
    })
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your merchant account transactions.</p>
        </div>


        <Button
          onClick={() => loadTransactions()}
          variant="outline"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>


      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>

        <div className='border p-4 rounded-md shadow-sm flex items-center justify-between'>
          <div className=''>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Transactions</p>
            <p className='text-2xl font-bold dark:text-white'>{totalTransactions ? totalTransactions : 0}</p>
          </div>
          <Separator orientation='vertical' />
          <div className='h-16 w-16 rounded-full flex items-center justify-center bg-primary/10'>
            <DollarSign className='w-6 h-6 text-primary' />
          </div>
        </div>

        <div className='border p-4 rounded-md shadow-sm flex items-center justify-between'>
          <div className=''>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Successful</p>
            <p className='text-2xl font-bold dark:text-white'>{totalSuccessful ? totalSuccessful : 0}</p>
          </div>
          <Separator orientation='vertical' />
          <div className='h-16 w-16 rounded-full flex items-center justify-center bg-green-500/10'>
            <CheckCircle2 className='w-6 h-6 text-green-500' />
          </div>
        </div>
        <div className='border p-4 rounded-md shadow-sm flex items-center justify-between'>
          <div className=''>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Failed</p>
            <p className='text-2xl font-bold dark:text-white'>{totalFailed ? totalFailed : 0}</p>
          </div>
          <Separator orientation='vertical' />
          <div className='h-16 w-16 rounded-full flex items-center justify-center bg-red-500/10'>
            <XCircle className='w-6 h-6 text-red-500' />
          </div>
        </div>
        <div className='border p-4 rounded-md shadow-sm flex items-center justify-between'>
          <div className=''>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Pending</p>
            <p className='text-2xl font-bold dark:text-white'>{totalPending ? totalPending : 0}</p>
          </div>
          <Separator orientation='vertical' />
          <div className='h-16 w-16 rounded-full flex items-center justify-center bg-yellow-500/10'>
            <Clock className='w-6 h-6 text-yellow-500' />
          </div>
        </div>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="checkout_sessions">Checkout Sessions</TabsTrigger>

        </TabsList>


        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className='text-lg font-semibold mb-4'>Filters</p>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>

                <div className='space-y-2'>
                  <Label className="text-xs text-gray-500 font-medium px-1">Search Transaction Reference</Label>
                  <Input
                    placeholder="Ex. TXNREF310720251330550238756"
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label className="text-xs text-gray-500 font-medium px-1">Search Customer</Label>
                  <Input
                    placeholder="Ex. 0961023847"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label className="text-xs text-gray-500 font-medium px-1">Search External Reference</Label>
                  <Input
                    placeholder="Ex. 8c3529cc-2b12-4990-93ad-80ba8764136a"
                    value={externalReference}
                    onChange={(e) => setExternalReference(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label className="text-xs text-gray-500 font-medium px-1">Select a Transaction Type</Label>
                  <Select value={transactionType || "all"} onValueChange={(val) => setTransactionType(val === 'all' ? '' : val)}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select a Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="collection">Collections</SelectItem>
                      <SelectItem value="disbursement">Disbursements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label>Search Channel</Label>
                  <Input
                    placeholder="Ex. Airtel"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label className="text-xs text-gray-500 font-medium px-1">Select a status</Label>
                  <Select value={status || "all"} onValueChange={(val) => setStatus(val === 'all' ? '' : val)}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="successful">Successful</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>

                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-gray-500 font-medium px-1">Start Date</span>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-gray-500 font-medium px-1">End Date</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 justify-end lg:col-span-4 mt-2">
                  <Button onClick={handleFilter} className="px-6">Filter</Button>
                  <Button onClick={handleClear} variant="outline" className="px-6">Clear</Button>
                </div>
              </div>


            </CardContent>
          </Card>


          <Card className="border border-gray-200 dark:border-gray-700  overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <CardTitle className="text-xl font-bold dark:text-white">Transaction History</CardTitle>
              <CardDescription className="dark:text-gray-400">Showing recent transactions.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
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
                  <NamelessDataTable
                    columns={TransactionColumns()}
                    data={transactions}
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

        </TabsContent>

        <TabsContent value="checkout_sessions" className="space-y-4">
          <Card>
            <CardContent>
              <p>Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardPage