"use client";
import React, { useEffect, useState } from "react";
import { MerchantsDataTable } from "./merchant-data-table";
import { UserColumns } from "./merchant-columns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api_endpoints } from "@/utils/api_constants";
import ViewUserDialog from "@/components/custom/dialogs/users/view-user-dialog";
import EditUserDialog from "@/components/custom/dialogs/users/edit-user-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useSession } from "next-auth/react";
import { User, UserDetails } from "@/utils/types/Users";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2, RefreshCw, Users, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MerchantsPage = () => {
  const [userData, setUserData] = useState<UserDetails[]>([]);
  const [viewUser, setViewUser] = useState<UserDetails | null>(null);
  const [editUser, setEditUser] = useState<UserDetails | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalMerchants, setTotalMerchants] = useState(0);
  const [activeMerchants, setActiveMerchants] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const body = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      };
      
      const response = await fetch(api_endpoints.backoffice.getMerchants, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",            
          "Authorization": `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(body),
      });
      
      const responseBody = await response.json();
      
      if (responseBody.status === "success") {
        if (responseBody?.users?.user) {
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
          setTotalMerchants(responseBody.users.total || users.length);
          
          // Calculate active merchants
          const active = users.filter((user: { status: string; }) => user.status === "active").length;
          setActiveMerchants(active);
        }
      } else {
        toast.error("Failed to fetch merchants");
      }
    } catch (error) {
      console.error("Error fetching merchants:", error);
      toast.error("An error occurred while fetching merchants");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (session?.accessToken) {
      fetchUsers();
    }
  }, [pagination.pageIndex, pagination.pageSize, session?.accessToken]);

  const handleDeleteUser = async () => {
    if (deleteUser) {
      try {
        const response = await fetch(`${api_endpoints.backoffice.deleteUser}/${deleteUser.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.accessToken}`
          }
        });
        
        const responseBody = await response.json();
        
        if (responseBody.status === "success") {
          toast.success(responseBody.message || "Merchant deleted successfully");
          setDeleteUser(null);
          fetchUsers(); // Refresh data instead of reloading page
        } else {
          toast.error(responseBody.error || "Failed to delete merchant");
        }
      } catch (error) {
        console.error("Error deleting merchant:", error);
        toast.error("Something went wrong! Please try again.");
      }
    }
  };

  const refreshData = () => {
    fetchUsers();
    toast.success("Data refreshed");
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merchant Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all merchant accounts in the system
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button 
            onClick={refreshData}
            variant="outline"
            className="flex items-center gap-1"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => router.push('/admin/merchants/create')}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Merchant
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Merchants</CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription className="text-3xl font-bold text-blue-700">{totalMerchants}</CardDescription>
              <Users className="h-8 w-8 text-blue-500 opacity-80" />
            </div>
          </CardHeader>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Merchants</CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription className="text-3xl font-bold text-green-700">{activeMerchants}</CardDescription>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                {((activeMerchants / totalMerchants) * 100).toFixed(0)}% Active
              </Badge>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Merchants</CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription className="text-3xl font-bold text-amber-700">{totalMerchants - activeMerchants}</CardDescription>
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                {totalMerchants > 0 ? (((totalMerchants - activeMerchants) / totalMerchants) * 100).toFixed(0) : 0}% Inactive
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3 pt-6 px-6">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-500" />
            Merchant Directory
          </CardTitle>
          <CardDescription>
            View, edit, and manage all merchant accounts. Select a merchant to see detailed information.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <div className={viewUser || editUser ? "hidden" : ""}>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading merchant data...</p>
                </div>
              </div>
            ) : userData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Users className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium">No merchants found</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-1">
                  There are no merchants in the system matching your current criteria.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => router.push('/admin/merchants/create')}
                >
                  Add your first merchant
                </Button>
              </div>
            ) : (
              <>
                <MerchantsDataTable
                  columns={UserColumns(setViewUser, setEditUser, setDeleteUser)}
                  data={userData}
                />
                
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {pagination.pageIndex * pagination.pageSize + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, (pagination.pageIndex * pagination.pageSize) + userData.length)} of {totalPages * pagination.pageSize}+ merchants
                  </p>
                  
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
                    >
                      Previous
                    </Button>
                    <div className="text-sm">
                      Page <span className="font-medium">{pagination.pageIndex + 1}</span> of <span className="font-medium">{totalPages || 1}</span>
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
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          
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
          
          <Dialog 
            open={!!deleteUser} 
            onOpenChange={(open) => !open && setDeleteUser(null)}
          >
            <DialogContent className="max-w-md rounded-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Confirm Merchant Deletion
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the merchant account and remove all associated data.
                </DialogDescription>
              </DialogHeader>
              
              {deleteUser && (
                <div className="bg-red-50 border border-red-100 rounded-md p-4 my-2">
                  <p className="font-medium">You are about to delete:</p>
                  <p className="text-sm mt-1"><span className="font-medium">Name:</span> {deleteUser.fullname}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {deleteUser.email}</p>
                  <p className="text-sm"><span className="font-medium">ID:</span> {deleteUser.id}</p>
                </div>
              )}
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteUser(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteUser}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Merchant
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantsPage;