"use client"

import React, { useEffect, useState } from "react";
import { UsersDataTable } from "./users-data-table";
import { UserColumns } from "./user-columns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, RefreshCw, Users2, Activity, ShieldAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ViewUserDialog from "@/components/custom/dialogs/users/view-user-dialog";
import EditUserDialog from "@/components/custom/dialogs/users/edit-user-dialog";
import { api_endpoints } from "@/utils/api_constants";
import { User, UserDetails } from "@/utils/types/Users";

const Users = () => {
  const [userData, setUserData] = useState<UserDetails[]>([]);
  const [viewUser, setViewUser] = useState<UserDetails | null>(null);
  const [editUser, setEditUser] =useState<UserDetails | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserDetails | null>(null);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalSystemUsers, setTotalSystemUsers] = useState(0);
  const [activeSystemUsers, setActiveSystemUsers] = useState(0);

  const fetchUsers = async () => {
        const body = {
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
        };
    
        const response = await fetch(api_endpoints.backoffice.getUsers, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.accessToken}`
          },
          body: JSON.stringify(body),
        });
    
        const responseBody = await response.json();
    
        setLoading(false)
    
        if (responseBody.status === "success") {
          if (responseBody?.users?.user) {
            const users = responseBody.users.user.map((user: User) => ({
              id: user.id,
              fullname: user.fullname,
              email: user.email,
              phone: user.phone,
              role: "Admin", // Default role or fetched from the data
              status: user.status
            }));
            setUserData(users);
            setTotalPages(responseBody.users.totalPages || 0);
            setTotalSystemUsers(responseBody.users.total || users.length);
    
    
            const active = users.filter((user: { status: string; }) => user.status === "active").length;
            setActiveSystemUsers(active);
          }
        }
      };
    
      useEffect(() => {
        fetchUsers();
      }, [pagination.pageIndex, pagination.pageSize]);
    
      const handleDeleteUser = async () => {
        if (deleteUser) {
    
          try {
    
            const response = await fetch(`${api_endpoints.backoffice.deleteUser}/${deleteUser.id}`, {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${session?.accessToken}`
              }
            })
    
            const responseBody = await response.json();
            
    
            if (responseBody["status"] == "success") {
              toast.success(responseBody["message"])
              window.location.reload()
            }
            else if (responseBody["status"] == "failure") {
              toast.error(responseBody["error"])
            }
            else {
              toast.error(responseBody["error"])
            }
    
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          catch (error) {
            toast.error(`Something went wrong! Please try again.`)
          }
        }
      }
    
      const refreshData = () => {
        fetchUsers();
        toast.success("Data refreshed");
      };
    

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all system accounts
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={refreshData}
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
            onClick={() => router.push('/admin/sys-users/create')}
          >
            <PlusCircle className="h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-md border-gray-200">
        <CardContent className="p-6">
          {/* Stats Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">System Users Overview</h2>
                <p className="text-sm text-gray-500">
                  Current statistics of system users
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3 mt-4">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                    <Users2 className="h-4 w-4" />
                    Total System Users
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-3xl font-bold text-blue-700">{totalSystemUsers}</CardDescription>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users2 className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Active System Users
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-3xl font-bold text-green-700">{activeSystemUsers}</CardDescription>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      {totalSystemUsers > 0 ? ((activeSystemUsers / totalSystemUsers) * 100).toFixed(0) : 0}% Active
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-600 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Inactive System Users
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-3xl font-bold text-amber-700">{totalSystemUsers - activeSystemUsers}</CardDescription>
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                      {totalSystemUsers > 0 ? (((totalSystemUsers - activeSystemUsers) / totalSystemUsers) * 100).toFixed(0) : 0}% Inactive
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Table Section */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">User Management</h2>
              <p className="text-sm text-gray-500">
                View, edit, and manage system user accounts
              </p>
            </div>
            
            <div className={viewUser || editUser ? "hidden" : ""}>
              {loading ? (
                <div className="py-20 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-gray-500">Loading users...</p>
                  </div>
                </div>
              ) : (
                <UsersDataTable
                  columns={UserColumns(setViewUser, setEditUser, setDeleteUser)}
                  data={userData}
                />
              )}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                Showing page {pagination.pageIndex + 1} of {totalPages || 1}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPagination((prev) => ({
                    ...prev,
                    pageIndex: Math.max(prev.pageIndex - 1, 0),
                  }))}
                  disabled={pagination.pageIndex === 0}
                  className="hover:bg-gray-100 transition-colors"
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex + 1,
                  }))}
                  disabled={pagination.pageIndex + 1 >= totalPages}
                  className="hover:bg-gray-100 transition-colors"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          
          {/* Dialogs */}
          <ViewUserDialog
            user={viewUser}
            open={!!viewUser}
            onClose={() => setViewUser(null)}
          />
          <EditUserDialog
            user={editUser}
            open={!!editUser}
            onClose={() => setEditUser(null)}
          />

          <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
            <DialogContent className="w-full max-w-md rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-red-600">Confirm User Deletion</DialogTitle>
              </DialogHeader>
              <p className="py-4">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setDeleteUser(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteUser}>
                  Delete User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;