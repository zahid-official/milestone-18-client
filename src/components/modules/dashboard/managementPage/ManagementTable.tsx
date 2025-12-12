"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import React from "react";

// Interfaces for IColumn
export interface IColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

// Interfaces for IManagementTable
export interface IManagementTable<T> {
  data: T[];
  columns: IColumn<T>[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  isRefreshing?: boolean;
}

// ManagementTable Component
function ManagementTable<T>({
  data = [],
  columns = [],
  onView,
  onEdit,
  onDelete,
  getRowKey,
  emptyMessage = "No records found.",
  isRefreshing = false,
}: IManagementTable<T>) {
  // Determine if any actions are provided
  const hasActions = Boolean(onView || onEdit || onDelete);
  const columnCount = columns.length + (hasActions ? 1 : 0);

  // Helper to render cell content based on accessor type
  const renderCell = (
    row: T,
    accessor: IColumn<T>["accessor"]
  ): React.ReactNode => {
    // If accessor is a function, call it with the row
    if (typeof accessor === "function") {
      return accessor(row);
    }

    // If accessor is a key, return the corresponding value
    const rowValue = row?.[accessor];
    if (rowValue === null || rowValue === undefined) {
      return "—";
    }
    if (typeof rowValue === "boolean") {
      return rowValue ? "Yes" : "No";
    }
    return String(rowValue);
  };

  return (
    <div className="relative overflow-hidden rounded-md border bg-card shadow-sm">
      {/* Refresh overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/70 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 rounded-full border bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Spinner className="size-4" />
            <span>Refreshing...</span>
          </div>
        </div>
      )}

      {/* Data table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns?.map((column, idx) => (
              <TableHead key={idx} className={column?.className}>
                {column?.header}
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="w-[72px] text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {data?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={Math.max(columnCount, 1)}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                {isRefreshing ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Spinner className="size-4" />
                    Loading...
                  </span>
                ) : (
                  emptyMessage
                )}
              </TableCell>
            </TableRow>
          ) : (
            data?.map((row, rowIndex) => (
              <TableRow key={getRowKey(row) ?? rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={column?.className}>
                    {renderCell(row, column?.accessor)}
                  </TableCell>
                ))}

                {hasActions && (
                  <TableCell className="text-right">
                    {/* Row action menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="hover:bg-muted"
                          aria-label="Row actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      {/* Dropdown content */}
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem
                            onClick={() => onView?.(row)}
                            className=" cursor-pointer"
                          >
                            <Eye className="size-4" />
                            View
                          </DropdownMenuItem>
                        )}

                        {onEdit && (
                          <DropdownMenuItem
                            onClick={() => onEdit?.(row)}
                            className=" cursor-pointer"
                          >
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                        )}

                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete?.(row)}
                            className="cursor-pointer"
                          >
                            <Trash2 className="size-4 text-destructive focus:text-destructive" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ManagementTable;
