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
import { BarChart, ShoppingBag, Store, UserPlus, ArrowUpRight, Plus, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MerchantStatistics, TopMerchants } from '@/utils/types/Dashboard';
import { useSession } from 'next-auth/react';
import { User, UserDetails } from '@/utils/types/Users';
import { api_endpoints } from '@/utils/api_constants';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';

const MerchantsTab = () => {
  const [cardData, setCardData] = useState<MerchantStatistics | null>(null);
  const [topMerchantsData, setTopMerchantsData] = useState<TopMerchants | null>(null);
  const [userData, setUserData] = useState<UserDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);

  const fetchMerchantStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(api_endpoints.backoffice.getMerchantStats, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
      });

      const responseBody = await response.json();

      if (responseBody.status === "success" && responseBody?.info) {
        setCardData(responseBody.info);
      }
      else if (responseBody["status"] == "failure") {
        toast.error(responseBody["error"])
      }
    } catch (error) {
      console.error("Error fetching merchant stats:", error);
    }
  };

  const fetchTopMerchants = async () => {
    try {
      const response = await fetch(api_endpoints.backoffice.getTopMerchants, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
      });

      const responseBody = await response.json();

      if (responseBody.status === "success" && responseBody?.info) {
        setTopMerchantsData(responseBody.info);
      }
      else if (responseBody["status"] == "failure") {
        toast.error(responseBody["error"])
      }
    } catch (error) {
      console.error("Error fetching top merchants:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const body = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      };

      const response = await fetch(api_endpoints.backoffice.getAllUsers, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(body),
      });

      const responseBody = await response.json();

      if (responseBody.status === "success" && responseBody?.users?.user) {
        const users = responseBody.users.user.map((user: User) => ({
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          role: "Merchant", // Default role or fetched from the data
          status: user.status
        }));
        setUserData(users);
        setTotalPages(responseBody.users.totalPages || 0);
      }  else if (responseBody["status"] == "failure") {
        toast.error(responseBody["error"])
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchMerchantStats();
      fetchTopMerchants();
      fetchUsers();
    }
  }, [session, pagination.pageIndex, pagination.pageSize]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (session?.accessToken) {
        fetchUsers();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
    } else if (status === "inactive") {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inactive</Badge>;
    } else {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{status}</Badge>;
    }
  };

  const calculateProgress = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <main className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Merchants Management</h1>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Merchant
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Merchant Statistics</span>
              <Store className="h-5 w-5 text-indigo-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Total Merchants</span>
                  <span className="font-bold text-lg">{cardData?.merchants ?? 0}</span>
                </div>
                <Progress value={100} className="h-2 bg-indigo-100 [&>div]:bg-indigo-500" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Active Merchants</span>
                  <span className="font-medium">{cardData?.active_merchants ?? 0} <span className="text-sm text-green-600">({Math.round((cardData?.active_merchants ?? 0) / (cardData?.merchants || 1) * 100)}%)</span></span>
                </div>
                <Progress 
                  value={calculateProgress(cardData?.active_merchants ?? 0, cardData?.merchants ?? 1)} 
                  className="h-2 bg-green-100" 
              
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Inactive Merchants</span>
                  <span className="font-medium">{cardData?.inactive_merchants ?? 0} <span className="text-sm text-red-600">({Math.round((cardData?.inactive_merchants ?? 0) / (cardData?.merchants || 1) * 100)}%)</span></span>
                </div>
                <Progress 
                  value={calculateProgress(cardData?.inactive_merchants ?? 0, cardData?.merchants ?? 1)} 
                  className="h-2 bg-red-100" 
                  
                />
              </div>

              <div className="pt-2 border-t">
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="rounded-md bg-blue-50 p-3 text-center">
                    <p className="text-xs text-blue-700">New Today</p>
                    <p className="text-xl font-bold text-blue-700">{cardData?.newToday ?? 0}</p>
                  </div>
                  <div className="rounded-md bg-purple-50 p-3 text-center">
                    <p className="text-xs text-purple-700">This Week</p>
                    <p className="text-xl font-bold text-purple-700">{cardData?.newWeeek ?? 0}</p>
                  </div>
                  <div className="rounded-md bg-emerald-50 p-3 text-center">
                    <p className="text-xs text-emerald-700">This Month</p>
                    <p className="text-xl font-bold text-emerald-700">{cardData?.newMonth ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Top Merchants</span>
              <BarChart className="h-5 w-5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {topMerchantsData?.merchant_one && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold mr-2">1</div>
                        <p className="font-medium truncate max-w-xs">{topMerchantsData.merchant_one}</p>
                      </div>
                      <div className="text-sm font-semibold">{topMerchantsData.merchant_one_count}</div>
                    </div>
                    <Progress value={100} className="h-2 bg-amber-100" />
                    <p className="text-xs text-gray-500 mt-1">Transactions</p>
                  </div>
                )}

                {topMerchantsData?.merchant_two && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 font-bold mr-2">2</div>
                        <p className="font-medium truncate max-w-xs">{topMerchantsData.merchant_two}</p>
                      </div>
                      <div className="text-sm font-semibold">{topMerchantsData.merchant_two_count}</div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">Transactions</p>
                  </div>
                )}

                {topMerchantsData?.merchant_three && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bronze-100 text-bronze-700 font-bold mr-2">3</div>
                        <p className="font-medium truncate max-w-xs">{topMerchantsData.merchant_three}</p>
                      </div>
                      <div className="text-sm font-semibold">{topMerchantsData.merchant_three_count}</div>
                    </div>
                   
                    <p className="text-xs text-gray-500 mt-1">Transactions</p>
                  </div>
                )}

                {!topMerchantsData?.merchant_one && !topMerchantsData?.merchant_two && !topMerchantsData?.merchant_three && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <ShoppingBag className="h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm text-muted-foreground">No top merchants available.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Quick Actions</span>
              <ArrowUpRight className="h-5 w-5 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Button className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="h-4 w-4" />
                  Add New Merchant
                </Button>
                
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Merchant Data
                </Button>
                
               
              </div>
              
              
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Merchant List</CardTitle>
              <CardDescription>Manage merchants and their details</CardDescription>
            </div>
            
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : userData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 p-3 mb-3">
                <Store className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No merchants found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{user.fullname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "—"}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.role}</TableCell>
                     
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {userData.length} of {totalPages * pagination.pageSize} merchants
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

export default MerchantsTab;