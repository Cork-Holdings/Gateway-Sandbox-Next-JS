"use client";
import React, { useEffect, useState } from "react";
import { UsersDataTable } from "./users-data-table";
import { UserColumns} from "./user-columns";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api_endpoints } from "@/utils/api_constants";
import ViewUserDialog from "@/components/custom/dialogs/users/view-user-dialog";
import EditUserDialog from "@/components/custom/dialogs/users/edit-user-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSession } from "next-auth/react";
import { User, UserDetails } from "@/utils/types/Users";
import { useRouter } from "next/navigation";



const Users = () => {
  const [userData, setUserData] = useState<UserDetails[]>([]);
  const [viewUser, setViewUser] = useState<UserDetails | null>(null);
  const [editUser, setEditUser] = useState<UserDetails | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserDetails | null>(null);
  const {data:session} = useSession()

  const router = useRouter()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);

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

    if (responseBody.status === "success") {
      if (responseBody?.users?.user) {
        const users = responseBody.users.user.map((user: User) => ({
          id: user.id,
          name: user.fullname,
          email: user.email,
          phone: user.phone,
          role: "Admin", // Default role or fetched from the data
     
        }));
        setUserData(users);
        setTotalPages(responseBody.users.totalPages || 0);
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
          headers:{
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


  return (
    <main className="m-8">
  
      <Card className="mt-16">
        <CardContent className="p-8">
          <div className="w-full flex justify-between pb-10">
            <Button
            onClick={()=> router.push('/admin/sys-users/create') }
            >
              Create
            </Button>
            <div></div>
          </div>
          <div>
            <p className="font-bold text-2xl">View, edit, delete</p>
            <p className="text-sm mb-1">
              Here you can view created users, edit them, and delete them.
            </p>
            <Separator />
          </div>

          <div className={viewUser || editUser ? "hidden" : ""}>
            <UsersDataTable
              columns={UserColumns(setViewUser, setEditUser, setDeleteUser)}
              data={userData}
            />
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(prev.pageIndex - 1, 0),
                }))
              }
              disabled={pagination.pageIndex === 0}
            >
              Previous
            </Button>
            <span>
              Page {pagination.pageIndex + 1} of {totalPages}
            </span>
            <Button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              disabled={pagination.pageIndex + 1 >= totalPages}
            >
              Next
            </Button>
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

          <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
            <DialogContent className='w-[350px] md:w-[800px] rounded-lg'>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </main>
  );
};

export default Users;
