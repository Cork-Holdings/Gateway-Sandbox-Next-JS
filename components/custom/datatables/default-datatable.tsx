"use client"

import * as React from "react"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    PaginationState,
    OnChangeFn,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageSizeOptions?: number[];
    // For controlled server-side pagination
    pageIndex?: number;
    pageSize?: number;
    totalPages?: number; // Total pages from server
    onPaginationChange?: (pageIndex: number, pageSize: number) => void;
    showNameFilter?: boolean; // Option to hide the name filter (e.g. for transactions)
}

export function DefaultDataTable<TData, TValue>({
    columns,
    data,
    pageSizeOptions = [10, 20, 50],
    pageIndex,
    pageSize,
    totalPages,
    onPaginationChange,
    showNameFilter = true,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    // Uncontrolled fallback state (if parent does not manage it)
    const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
        pageIndex: 0, // Start at the first page (zero-based index)
        pageSize: 10, // Default number of items per page
    });
    // Control pagination from parent if provided
    const controlledPagination = (typeof pageIndex === 'number' && typeof pageSize === 'number');
    const pagination = controlledPagination ? { pageIndex, pageSize } : internalPagination;

    const setPagination: OnChangeFn<PaginationState> = (updaterOrValue) => {
        if (controlledPagination && onPaginationChange) {
            const newPagination = typeof updaterOrValue === 'function'
                ? updaterOrValue(pagination)
                : updaterOrValue;
            onPaginationChange(newPagination.pageIndex, newPagination.pageSize);
        } else {
            setInternalPagination(updaterOrValue);
        }
    };

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        // Client-side pagination over the provided data
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="w-full space-y-4 dark:bg-inherit">
            {showNameFilter && table.getColumn("name") && (
                <div className="flex flex-col sm:flex-row sm:items-center py-4 gap-3 dark:bg-inherit">
                    <Input
                        placeholder="Filter names..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm dark:bg-inherit dark:border-gray-600"
                    />
                </div>
            )}

            {/* Mobile view (card-like layout) */}
            <div className="block sm:hidden">
                <div className="space-y-4">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <div
                                key={row.id}
                                className="bg-white dark:bg-[#1b2a3b] p-4 rounded-lg shadow border dark:border-gray-600"
                            >
                                {row.getVisibleCells().map((cell) => {
                                    // Skip rendering the Actions column header in the card view
                                    if (cell.column.id === "Actions") {
                                        return (
                                            <div key={cell.id} className="mt-4 flex justify-end">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        );
                                    }
                                    if (cell.column.id === "about") {
                                        return (
                                            <div key={cell.id} className="hidden">
                                                <div >{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                                            </div>
                                        );
                                    }

                                    // For other columns, show the label and value
                                    const header = cell.column.columnDef.header;
                                    const headerContent = typeof header === 'string'
                                        ? header
                                        : cell.column.id.charAt(0).toUpperCase() + cell.column.id.slice(1);

                                    return (
                                        <div key={cell.id} className="flex justify-between py-2 border-b dark:border-gray-600 last:border-0">
                                            <span className="font-medium">
                                                {headerContent}
                                            </span>
                                            <span>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4">No results.</div>
                    )}
                </div>
            </div>

            {/* Desktop view (traditional table) */}
            {/* <div className="hidden sm:block">
                <div className="rounded-md border dark:border-gray-600">
                    <ScrollArea className="w-full">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="text-center">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="text-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </div> */}
            <div className="hidden sm:block">
                <div className="overflow-x-auto w-full">
                    <div className="min-w-[1000px] rounded-md border dark:border-gray-600">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="text-center whitespace-nowrap">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="text-center whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <select
                        className="border rounded-md px-2 py-1 text-sm bg-transparent dark:border-gray-600"
                        value={pagination.pageSize}
                        onChange={(e) => {
                            const newPageSize = Number(e.target.value);
                            if (controlledPagination && onPaginationChange) {
                                onPaginationChange(0, newPageSize);
                            } else {
                                setPagination({
                                    pageIndex: 0,
                                    pageSize: newPageSize,
                                });
                            }
                        }}
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="glass-pagination-btn w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                            if (controlledPagination && onPaginationChange) {
                                onPaginationChange(Math.max(0, pagination.pageIndex - 1), pagination.pageSize);
                            } else {
                                setPagination({
                                    pageIndex: Math.max(0, pagination.pageIndex - 1),
                                    pageSize: pagination.pageSize,
                                });
                            }
                        }}
                        disabled={pagination.pageIndex <= 0}
                    >
                        ←
                    </button>
                    <span className="text-sm text-muted-foreground">
                        Page {pagination.pageIndex + 1}
                        {" of "}{controlledPagination ? totalPages || 1 : (table.getPageCount() || 1)}
                    </span>
                    <button
                        className="glass-pagination-btn w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                            if (controlledPagination && onPaginationChange) {
                                onPaginationChange(pagination.pageIndex + 1, pagination.pageSize);
                            } else {
                                setPagination({
                                    pageIndex: pagination.pageIndex + 1,
                                    pageSize: pagination.pageSize,
                                });
                            }
                        }}
                        disabled={controlledPagination
                            ? pagination.pageIndex + 1 >= (totalPages || 1)
                            : pagination.pageIndex + 1 >= (table.getPageCount() || 1)}
                    >
                        →
                    </button>
                </div>
            </div>

        </div>
    );
}