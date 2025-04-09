import React from 'react'
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";

  import { Progress } from "@/components/ui/progress";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  

  const recentTransactions = [
    { id: 1, reference: "TRX123456", amount: "$1,250.00", status: "Successful", customer: "John Doe", channel: "Card", type: "Payment", date: "Today, 10:25 AM" },
    { id: 2, reference: "TRX123457", amount: "$750.00", status: "Failed", customer: "Jane Smith", channel: "Bank", type: "Transfer", date: "Today, 09:15 AM" },
    { id: 3, reference: "TRX123458", amount: "$2,500.00", status: "Pending", customer: "Acme Corp", channel: "Card", type: "Payment", date: "Yesterday, 05:30 PM" },
    { id: 4, reference: "TRX123459", amount: "$180.00", status: "Successful", customer: "Bob Johnson", channel: "Wallet", type: "Withdrawal", date: "Yesterday, 03:45 PM" }
  ];
const TransactionsTab = () => {
  return (
    <main className='flex flex-col gap-5'>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Transaction Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Transactions</span>
                        <span className="font-medium">12,580</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Successful</span>
                        <span className="font-medium">11,250 (89.4%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Failed</span>
                        <span className="font-medium">820 (6.5%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending</span>
                        <span className="font-medium">510 (4.1%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Amount</span>
                        <span className="font-medium">$823,450.75</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Transaction Channels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Card</span>
                          <span>65%</span>
                        </div>
                        <Progress value={65} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Bank Transfer</span>
                          <span>20%</span>
                        </div>
                        <Progress value={20} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Wallet</span>
                          <span>10%</span>
                        </div>
                        <Progress value={10} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Other</span>
                          <span>5%</span>
                        </div>
                        <Progress value={5} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">View Failed Transactions</Button>
                      <Button variant="outline" className="w-full">View Pending Transactions</Button>
                      <Button variant="outline" className="w-full">Generate Transaction Report</Button>
                      <Button variant="outline" className="w-full">Export Transaction Data</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Detailed transaction history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reference</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Channel</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
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
                            <TableCell>{tx.channel}</TableCell>
                            <TableCell>{tx.type}</TableCell>
                            <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">View</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
    </main>
  )
}

export default TransactionsTab