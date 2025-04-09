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

const ApisTab = ()  => {
  return (
    <main className='flex flex-col gap-5'>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>API Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Requests</span>
                        <span className="font-medium">{apiStats.totalRequests.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Requests Today</span>
                        <span className="font-medium">{apiStats.requestsToday.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Error Rate</span>
                        <span className="font-medium">{apiStats.errorRate}%</span>
                      </div>
                      <div className="pt-4">
                        <p className="text-sm font-medium mb-2">Top Endpoints</p>
                        <ul className="space-y-2">
                          {apiStats.topEndpoints.map((endpoint, i) => (
                            <li key={i} className="text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">{endpoint.method} {endpoint.endpoint}</span>
                                <span>{endpoint.calls.toLocaleString()}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Endpoint Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Response Time (avg)</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>/api/transactions/create</span>
                            <span>145ms</span>
                          </div>
                          <Progress value={72} />
                          <div className="flex items-center justify-between text-sm">
                            <span>/api/users/verify</span>
                            <span>95ms</span>
                          </div>
                          <Progress value={47} />
                          <div className="flex items-center justify-between text-sm">
                            <span>/api/transactions/status</span>
                            <span>65ms</span>
                          </div>
                          <Progress value={32} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>API Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button className="w-full">Create New API</Button>
                      <Button variant="outline" className="w-full">Manage Rate Limits</Button>
                      <Button variant="outline" className="w-full">API Documentation</Button>
                      <Button variant="outline" className="w-full">View API Logs</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                  <CardDescription>Manage and monitor API endpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Endpoint</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Requires Auth</TableHead>
                          <TableHead>Calls (24h)</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">/api/transactions/create</TableCell>
                          <TableCell>POST</TableCell>
                          <TableCell>Create a new transaction</TableCell>
                          <TableCell>Yes</TableCell>
                          <TableCell>5,280</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">/api/users/verify</TableCell>
                          <TableCell>POST</TableCell>
                          <TableCell>Verify user credentials</TableCell>
                          <TableCell>Yes</TableCell>
                          <TableCell>4,150</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">/api/transactions/status</TableCell>
                          <TableCell>GET</TableCell>
                          <TableCell>Check transaction status</TableCell>
                          <TableCell>Yes</TableCell>
                          <TableCell>3,890</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">/api/checkout/url</TableCell>
                          <TableCell>POST</TableCell>
                          <TableCell>Generate checkout URL</TableCell>
                          <TableCell>Yes</TableCell>
                          <TableCell>2,450</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
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

export default ApisTab 