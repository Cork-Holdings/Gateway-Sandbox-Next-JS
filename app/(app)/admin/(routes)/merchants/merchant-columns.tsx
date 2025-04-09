"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { UserDetails } from "@/utils/types/Users"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"


type UserActionsProps = {
  row: UserDetails;
  onView: (user: UserDetails) => void;
  onEdit: (user: UserDetails) => void;
  onDelete: (user: UserDetails) => void;

};

const UserActions: React.FC<UserActionsProps> = ({ row, onView, onEdit, onDelete }) => {

  const router = useRouter()

  const resetPassword = () => {
    router.push(`/admin/reset?email=${row.email}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onView(row)}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(row)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(row)}>Delete</DropdownMenuItem>
        <DropdownMenuItem onClick={() => resetPassword()}>Reset Password</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};



const StatusCell = ({ row }: { row: UserDetails }) => {

  const status = row.status


  return (
    <div className={ status == "active"? "p-2  capitalize bg-green-200 rounded-2xl text-green-700": status == "pending" ?  "p-2 capitalize bg-orange-200 rounded-2xl text-orange-500":"p-2 bg-red-200 capitalize rounded-2xl text-red-700"}>
{status}
    </div>
  );
};

export const UserColumns = (
  setViewUser: (user: UserDetails | null) => void,
  setEditUser: (user: UserDetails | null) => void,
  onDelete: (user: UserDetails) => void,
): ColumnDef<UserDetails>[] => [
    {
      accessorKey: "fullname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusCell row={row.original} />
    },
    
    {
      accessorKey: "role",
      header: "Role",
      
    },
    {
      id: "Actions",
      header: "Actions",
      cell: ({ row }) => (
        <UserActions
          row={row.original}
          onView={setViewUser}
          onEdit={setEditUser}
          onDelete={onDelete}
        />
      ),
    },
  ];