import React from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


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

const MerchantsTab = () => {
  return (
    <main>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Merchant Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Merchants</span>
                        <span className="font-medium">{merchantStats.total}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Merchants</span>
                        <span className="font-medium">{merchantStats.active} ({Math.round(merchantStats.active/merchantStats.total*100)}%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Inactive Merchants</span>
                        <span className="font-medium">{merchantStats.inactive} ({Math.round(merchantStats.inactive/merchantStats.total*100)}%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New Today</span>
                        <span className="font-medium">{merchantStats.newToday}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New This Week</span>
                        <span className="font-medium">{merchantStats.newThisWeek}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New This Month</span>
                        <span className="font-medium">{merchantStats.newThisMonth}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Top Merchants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {merchantStats.topMerchants.map((merchant, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{merchant.name}</p>
                            <p className="text-xs text-muted-foreground">{merchant.apiCalls.toLocaleString()} API calls</p>
                          </div>
                          <div className="text-sm">{merchant.transactions} transactions</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button className="w-full">Add New Merchant</Button>
                      <Button variant="outline" className="w-full">Manage API Keys</Button>
                      <Button variant="outline" className="w-full">Bulk Actions</Button>
                      <Button variant="outline" className="w-full">Export Merchant Data</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Merchant List</CardTitle>
                  <CardDescription>Manage merchants and their details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Merchant Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>API Calls (7d)</TableHead>
                          <TableHead>Transactions (7d)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Tech Solutions</TableCell>
                          <TableCell>contact@techsolutions.com</TableCell>
                          <TableCell>12,500</TableCell>
                          <TableCell>825</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-100 text-green-700">Active</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Finance App Inc</TableCell>
                          <TableCell>support@financeapp.com</TableCell>
                          <TableCell>8,700</TableCell>
                          <TableCell>650</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-100 text-green-700">Active</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">E-commerce Pro</TableCell>
                          <TableCell>info@ecommercepro.com</TableCell>
                          <TableCell>7,850</TableCell>
                          <TableCell>580</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-100 text-green-700">Active</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Global Logistics</TableCell>
                          <TableCell>dev@globallogistics.com</TableCell>
                          <TableCell>5,230</TableCell>
                          <TableCell>320</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-red-100 text-red-700">Inactive</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
    </main>
  )
}

export default MerchantsTab