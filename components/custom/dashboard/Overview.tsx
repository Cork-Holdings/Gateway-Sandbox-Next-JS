import React from 'react'
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
  } from "@/components/ui/card";
  import { 
    Activity, 
    AlertTriangle, 
    Users, 
    Store,
  } from "lucide-react";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  


  const securityAlerts = [
    { id: 1, type: "Failed Login Attempts", count: 23, severity: "Medium", time: "Today" },
    { id: 2, type: "API Rate Limit Exceeded", count: 15, severity: "Low", time: "Today" },
    { id: 3, type: "Admin Permission Change", count: 2, severity: "High", time: "Yesterday" }
  ];


  const userStats = {
    total: 1250,
    newToday: 12,
    newThisWeek: 78,
    newThisMonth: 245,
    active: 890,
    inactive: 360,
    byRole: [
      { role: "Admin", count: 5 },
      { role: "Developer", count: 850 },
      { role: "Merchant", count: 395 }
    ]
  };

  const recentTransactions = [
    { id: 1, reference: "TRX123456", amount: "$1,250.00", status: "Successful", customer: "John Doe", channel: "Card", type: "Payment", date: "Today, 10:25 AM" },
    { id: 2, reference: "TRX123457", amount: "$750.00", status: "Failed", customer: "Jane Smith", channel: "Bank", type: "Transfer", date: "Today, 09:15 AM" },
    { id: 3, reference: "TRX123458", amount: "$2,500.00", status: "Pending", customer: "Acme Corp", channel: "Card", type: "Payment", date: "Yesterday, 05:30 PM" },
    { id: 4, reference: "TRX123459", amount: "$180.00", status: "Successful", customer: "Bob Johnson", channel: "Wallet", type: "Withdrawal", date: "Yesterday, 03:45 PM" }
  ];
  const merchantStats = {
    total: 395,
    newToday: 3,
    newThisWeek: 18,
    newThisMonth: 52,
    active: 345,
    inactive: 50,
    topMerchants: [
      { id: 1, name: "Tech Solutions", apiCalls: 12500, transactions: 825 },
      { id: 2, name: "Finance App Inc", apiCalls: 8700, transactions: 650 },
      { id: 3, name: "E-commerce Pro", apiCalls: 7850, transactions: 580 }
    ]
  };

  const apiStats = {
    totalRequests: 254879,
    requestsToday: 15782,
    errorRate: 1.2,
    topEndpoints: [
      { endpoint: "/api/transactions/create", calls: 45672, method: "POST" },
      { endpoint: "/api/users/verify", calls: 35241, method: "POST" },
      { endpoint: "/api/transactions/status", calls: 28567, method: "GET" }
    ]
  };

const Overview = () => {
  return (
    <main className='flex flex-col gap-5'>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.total}</div>
                    <p className="text-xs text-muted-foreground">
                      +{userStats.newThisWeek} this week
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Merchants</CardTitle>
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{merchantStats.total}</div>
                    <p className="text-xs text-muted-foreground">
                      +{merchantStats.newThisWeek} this week
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">API Requests (Today)</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{apiStats.requestsToday.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {apiStats.errorRate}% error rate
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{securityAlerts.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {securityAlerts.filter(a => a.severity === "High").length} high priority
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Showing recent transaction activity</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        {recentTransactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell className="font-medium">{tx.reference}</TableCell>
                            <TableCell>{tx.amount}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                                tx.status === "Successful" ? "bg-green-100 text-green-700" : 
                                tx.status === "Failed" ? "bg-red-100 text-red-700" : 
                                "bg-amber-100 text-amber-700"
                              }`}>
                                {tx.status}
                              </span>
                            </TableCell>
                            <TableCell>{tx.customer}</TableCell>
                            <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Security Alerts</CardTitle>
                    <CardDescription>Recent security-related events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {securityAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center space-x-4">
                          <div className={`rounded-full p-2 ${
                            alert.severity === "High" ? "bg-red-100" : 
                            alert.severity === "Medium" ? "bg-amber-100" : 
                            "bg-blue-100"
                          }`}>
                            <AlertTriangle className={`h-4 w-4 ${
                              alert.severity === "High" ? "text-red-600" : 
                              alert.severity === "Medium" ? "text-amber-600" : 
                              "text-blue-600"
                            }`} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{alert.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {alert.count} occurrences | {alert.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
    </main>
  )
}

export default Overview