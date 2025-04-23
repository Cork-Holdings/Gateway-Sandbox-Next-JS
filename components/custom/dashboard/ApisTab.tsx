
"use client"
import React, { useEffect, useState } from 'react'
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
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Activity, Clock, AlertTriangle, BarChart } from "lucide-react";
import { API, APIResponseTimes, APIStatistics } from '@/utils/types/Dashboard';
import { useSession } from 'next-auth/react';
import { api_endpoints } from '@/utils/api_constants';
import toast from 'react-hot-toast';

const ApisTab = () => {
  const [cardData, setCardData] = useState<APIStatistics | null>(null)
  const [apiResponeTimesData, setAPIResponeTimesData] = useState<APIResponseTimes | null>(null)
  const [apiData, setApiData] = useState<API[]>([]);
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);

  const fetchAPIResStats = async () => {
    try {
      const response = await fetch(api_endpoints.backoffice.getResponseTimes, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
      });

      const responseBody = await response.json();

      if (responseBody.status === "success" && responseBody?.info) {
        setAPIResponeTimesData(responseBody.info);
      }
      else if (responseBody["status"] == "failure") {
        toast.error(responseBody["error"])
      }
    } catch (error) {
      console.error("Failed to fetch API response times:", error);
    }
  };

  const fetchAPIStats = async () => {
    try {
      const response = await fetch(api_endpoints.backoffice.getAPIStats, {
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
      console.error("Failed to fetch API stats:", error);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const body = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      };

      const response = await fetch(api_endpoints.backoffice.getAPIRequests, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(body),
      });

      const responseBody = await response.json();

      if (responseBody.status === "success" && responseBody?.requests?.request) {
        const requests = responseBody.requests.request.map((request: API) => ({
          id: request.id,
          user_id: request.user_id,
          status: request.status,
          endpoint: request.endpoint,
          method: request.method,
          ip_address: request.ip_address
        }));
        setApiData(requests);
        setTotalPages(responseBody.requests.totalPages || 0);
      } else if (responseBody["status"] == "failure") {
        toast.error(responseBody["error"])
      }
    } catch (error) {
      console.error("Failed to fetch API requests:", error);
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      const fetchData = async () => {
        await Promise.all([
          fetchRequests(),
          fetchAPIStats(),
          fetchAPIResStats()
        ]);
      };

      fetchData();
    }
  }, [pagination.pageIndex, pagination.pageSize, session?.accessToken]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "failed":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      default:
        return "bg-amber-100 text-amber-700 hover:bg-amber-200";
    }
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method?.toUpperCase()) {
      case "GET":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "POST":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "PUT":
        return "bg-amber-100 text-amber-700 hover:bg-amber-200";
      case "DELETE":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  // Calculate percentages for progress bars
  const calculateProgressPercentage = (time: string) => {
    if (!time) return 0;
    // Extract numeric value from string like "145 ms"
    const value = parseInt(time);
    // Use 200ms as the baseline for 100%
    return Math.min(Math.round((value / 200) * 100), 100);
  };

  return (
    <main className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                API Statistics
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Requests</span>
                <span className="font-semibold text-lg">{cardData?.requests ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Requests Today</span>
                <span className="font-semibold text-lg">{cardData?.requests_today ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Failed Requests</span>
                <span className="font-semibold text-lg text-red-600">{cardData?.error_rate ?? 0}</span>
              </div>
              <div className="pt-4">
                <p className="text-sm font-medium mb-3 flex items-center gap-1">
                  <BarChart className="h-4 w-4 text-blue-500" />
                  Top Endpoints
                </p>
                <div className="space-y-4">
                  {cardData?.endpoint1 && (
                    <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                      <div className="truncate max-w-48">
                        <p className="font-medium text-sm">{cardData?.endpoint1}</p>
                      </div>
                      <div className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {cardData?.endpoint1Count ?? 0}
                      </div>
                    </div>
                  )}

                  {cardData?.endpoint2 && (
                    <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                      <div className="truncate max-w-48">
                        <p className="font-medium text-sm">{cardData?.endpoint2}</p>
                      </div>
                      <div className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {cardData?.endpoint2Count ?? 0}
                      </div>
                    </div>
                  )}

                  {cardData?.endpoint3 && (
                    <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                      <div className="truncate max-w-48">
                        <p className="font-medium text-sm">{cardData?.endpoint3}</p>
                      </div>
                      <div className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {cardData?.endpoint3Count ?? 0}
                      </div>
                    </div>
                  )}

                  {!cardData?.endpoint1 && !cardData?.endpoint2 && !cardData?.endpoint3 && (
                    <p className="text-sm text-muted-foreground italic">No endpoint data available</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                Response Time Performance
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="space-y-3">
                {apiResponeTimesData?.endpoint1 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate max-w-48">{apiResponeTimesData?.endpoint1}</span>
                      <span className="text-purple-700">{apiResponeTimesData?.endpoint1Time ?? "0 ms"}</span>
                    </div>
                    <Progress
                      value={calculateProgressPercentage(apiResponeTimesData?.endpoint1Time)}
                      className="h-2 bg-purple-100"
                    />
                  </div>
                )}

                {apiResponeTimesData?.endpoint2 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate max-w-48">{apiResponeTimesData?.endpoint2}</span>
                      <span className="text-purple-700">{apiResponeTimesData?.endpoint2Time ?? "0 ms"}</span>
                    </div>
                    <Progress
                      value={calculateProgressPercentage(apiResponeTimesData?.endpoint2Time)}
                      className="h-2 bg-purple-100"
                    />
                  </div>
                )}

                {apiResponeTimesData?.endpoint3 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate max-w-48">{apiResponeTimesData?.endpoint3}</span>
                      <span className="text-purple-700">{apiResponeTimesData?.endpoint3Time ?? "0 ms"}</span>
                    </div>
                    <Progress
                      value={calculateProgressPercentage(apiResponeTimesData?.endpoint3Time)}
                      className="h-2 bg-purple-100"
                    />
                  </div>
                )}

                {!apiResponeTimesData?.endpoint1 && !apiResponeTimesData?.endpoint2 && !apiResponeTimesData?.endpoint3 && (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-sm text-muted-foreground italic">No response time data available</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md lg:col-span-1 md:col-span-2">
          <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                System Health
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm font-medium text-green-700">API Uptime</p>
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm font-medium text-blue-700">Avg Response</p>
                  <p className="text-2xl font-bold text-blue-600">85ms</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium mb-2">Success Rate</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: cardData?.error_rate ? `${100 - (cardData?.error_rate || 0)}%` : '100%' }}
                  ></div>
                </div>
                <p className="text-xs text-right text-gray-500">
                  {cardData?.error_rate ? `${100 - (cardData?.error_rate || 0)}%` : '100%'} successful requests
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>API Requests</CardTitle>
              <CardDescription>Monitor all API endpoints and activity</CardDescription>
            </div>
            {loading && (
              <div className="flex items-center text-sm text-muted-foreground">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading data...
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-medium">Endpoint</TableHead>
                  <TableHead className="font-medium">Method</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">User</TableHead>
                  <TableHead className="font-medium">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiData.length > 0 ? (
                  apiData.map((request) => (
                    <TableRow key={request.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium truncate max-w-32 md:max-w-48">
                        {request.endpoint}
                      </TableCell>
                      <TableCell>
                        <Badge className={getMethodBadgeClass(request.method)}>
                          {request.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{request.user_id}</TableCell>
                      <TableCell className="font-mono text-sm">{request.ip_address}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {loading ? "Loading data..." : "No API requests found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {apiData.length > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, (pagination.pageIndex * pagination.pageSize) + apiData.length)} of {totalPages * pagination.pageSize}+ entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: Math.max(prev.pageIndex - 1, 0),
                  }))
                }
                disabled={pagination.pageIndex === 0 || loading}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <div className="text-sm font-medium">
                Page {pagination.pageIndex + 1} of {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex + 1,
                  }))
                }
                disabled={pagination.pageIndex + 1 >= totalPages || loading}
                className="flex items-center gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default ApisTab