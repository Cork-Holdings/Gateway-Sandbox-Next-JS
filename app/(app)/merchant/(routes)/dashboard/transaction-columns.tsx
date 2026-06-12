"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Transaction } from "@/utils/types/Filters"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "date-fns"



type UserActionsProps = {
    row: Transaction;
    // onView: (course: Transaction) => void;
    // onEdit: (course: Transaction) => void;
    // onDelete: (course: Transaction) => void;

};



const UserActions: React.FC<UserActionsProps> = ({ row }) => {

    const courseID = row.id;
    const router = useRouter()


    return (
        <>
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
                    <DropdownMenuItem onClick={() => { }}>View</DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

        </>
    );
};


const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'successful':
        case 'success':
        case 'completed':
            return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-2 py-0.5 rounded-full">Successful</Badge>
        case 'pending':
            return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-2 py-0.5 rounded-full">Pending</Badge>
        case 'failed':
            return <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-2 py-0.5 rounded-full">Failed</Badge>
        default:
            return <Badge className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-2 py-0.5 rounded-full">{status}</Badge>
    }
}



const getTypeBadge = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'collection':
            return <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-2 py-0.5 rounded-full">Collection</Badge>
        case 'disbursement':
            return <Badge className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-2 py-0.5 rounded-full">Disbursment</Badge>
        default:
            return <Badge className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-2 py-0.5 rounded-full">{status}</Badge>
    }
}


export const TransactionColumns = (): ColumnDef<Transaction>[] => [

    {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => (
            <div className="flex items-center justify-center gap-2">
                <div className="text-sm">
                    {row.original.reference}
                </div>
            </div>
        )
    },
    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => (
            <div className="flex items-center justify-center gap-2">
                {row.original.customer}
            </div>
        )
    },

    {
        accessorKey: "channel",
        header: "Channel",
        cell: ({ row }) => (
            <div className="flex items-center justify-center gap-2">
                <div className="text-sm">
                    {row.original.channel.toLocaleUpperCase()}
                </div>
            </div>
        )
    },

    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => getTypeBadge(row.original.type)
    },



    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
            <div className="flex items-center justify-center gap-2">
                {formatDate(row.original.date, "dd/MM/yyyy")}
            </div>
        )
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original.status)
    },

    {
        accessorKey: "narration",
        header: "Narration",
        cell: ({ row }) => (
            <div className="flex items-center justify-center gap-2">
                {row.original.narration ?? "-"}
            </div>
        )
    },
    // {
    //     accessorKey: "createdAt",
    //     header: "Date Created"
    // },

    // {
    //     id: "Actions",
    //     header: "Actions",
    //     cell: ({ row }) => (
    //         <UserActions
    //             row={row.original}
    //         />
    //     ),
    // }
]