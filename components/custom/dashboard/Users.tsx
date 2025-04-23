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
  UserPlus, 
  DownloadIcon, 
  RefreshCcwIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";
import { useSession } from 'next-auth/react';
import { User, UserDetails } from '@/utils/types/Users';
import { api_endpoints } from '@/utils/api_constants';
import { UserStatistics } from '@/utils/types/Dashboard';
import toast from 'react-hot-toast';


const UsersTab = () => {
  const [cardData, setCardData] = useState<UserStatistics | null>(null);
  const [userData, setUserData] = useState<UserDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(api_endpoints.backoffice.getUserStats, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
      });

      const responseBody = await response.json();
      if (responseBody.status === "success" && responseBody?.info) {
        setCardData(responseBody.info);
      }   else if (responseBody["status"] == "failure") {
        toast.error(responseBody["error"])
      }
    } catch (error) {
      console.error("Error fetching user statistics:", error);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
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
          role: user.role || "Merchant", // Default role or fetched from the data
          status: user.status
        }));
        setUserData(users);
        setTotalPages(responseBody.users.totalPages || 0);
      }   else if (responseBody["status"] == "failure") {
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
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchUsers(),
          fetchUserStats()
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session?.accessToken) {
      loadData();
    }
  }, [pagination.pageIndex, pagination.pageSize, session?.accessToken]);

  const refreshData = () => {
    fetchUsers();
    fetchUserStats();
  };


  const getStatusBadgeStyle = (status: string) => {
    status = status.toLowerCase();
    if (status === "active") {
      return "bg-green-100 text-green-700";
    } else if (status === "inactive") {
      return "bg-red-100 text-red-700";
    }
    return "bg-amber-100 text-amber-700";
  };

  return (
    <main className="flex flex-col gap-6">
      {/* Header Section */}
      <h2 className="text-2xl font-bold">User Management</h2>
       
      <div className="flex items-center justify-between">
        <div></div>
        <div className='flex gap-5 items-center'>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          className="flex items-center gap-2"
        >
          <RefreshCcwIcon size={16} />
          Refresh Data
        </Button>

        <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              Add New User
            </Button>
     
            <Button variant="outline" className="flex items-center gap-2">
              <DownloadIcon size={16} />
              Export User Data
            </Button>
        </div>
       
      </div>
      
      {/* Statistics Cards Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl font-bold">{cardData?.users ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-muted-foreground text-sm">
              All registered users
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm bg-green-50">
          <CardHeader className="pb-2">
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-3xl font-bold text-green-600">{cardData?.active_users ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-muted-foreground text-sm">
              {cardData?.users ? `${Math.round(((cardData.active_users ?? 0) / (cardData.users ?? 0)) * 100)}%` : '0%'} of total users
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm bg-red-50">
          <CardHeader className="pb-2">
            <CardDescription>Inactive Users</CardDescription>
            <CardTitle className="text-3xl font-bold text-red-600">{cardData?.inactive_users ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-muted-foreground text-sm">
              {cardData?.users ? `${Math.round(((cardData?.inactive_users ?? 0) / (cardData?.users ?? 0)) * 100)}%` : '0%'} of total users
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm bg-blue-50">
          <CardHeader className="pb-2">
            <CardDescription>Admin Users</CardDescription>
            <CardTitle className="text-3xl font-bold text-blue-600">{cardData?.adminUsers ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-muted-foreground text-sm">
              {cardData?.users ? `${Math.round(((cardData?.adminUsers ?? 0) / (cardData?.users ?? 0)) * 100)}%` : '0%'} of total users
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution and Quick Actions Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>Overview of user types in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {cardData ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Admin Users</span>
                    </div>
                    <span className="font-medium">{Math.round((cardData.adminUsers / cardData.users) * 100)}%</span>
                  </div>
                  <Progress 
                    value={Math.round(((cardData.adminUsers ?? 0) / (cardData.users ?? 0)) * 100)} 
                    className="h-2 bg-gray-100" 
               
                  />
                  <div className="text-xs text-muted-foreground">{cardData.adminUsers ?? 0} users</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Merchant Users</span>
                    </div>
                    <span className="font-medium">{Math.round(((cardData.merchantUsers ?? 0) / (cardData.users  ?? 0)) * 100)}%</span>
                  </div>
                  <Progress 
                    value={Math.round(((cardData.merchantUsers ?? 0) / (cardData.users ?? 0)) * 100)} 
                    className="h-2 bg-gray-100" 
                 
                  />
                  <div className="text-xs text-muted-foreground">{cardData.merchantUsers ?? 0} users</div>
                </div>
                
                
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
          </CardContent>
        </Card>

     
      </div>

      {/* User List Table Section */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User List</CardTitle>
            <CardDescription>Manage system users and their details</CardDescription>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.length > 0 ? (
                    userData.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{user.fullname}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadgeStyle(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                 
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found
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
            Showing {userData.length} of {totalPages * pagination.pageSize} users
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

export default UsersTab;