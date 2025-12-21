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
  isViewDisabled?: (row: T) => boolean;
  isEditDisabled?: (row: T) => boolean;
  isDeleteDisabled?: (row: T) => boolean;
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  isRefreshing?: boolean;
  viewLabel?: string;
  viewIcon?: React.ReactNode;
  editLabel?: string;
  editIcon?: React.ReactNode;
  deleteLabel?: string;
  deleteIcon?: React.ReactNode;
}

// ManagementTable Component
function ManagementTable<T>({
  data = [],
  columns = [],
  onView,
  onEdit,
  onDelete,
  isViewDisabled,
  isEditDisabled,
  isDeleteDisabled,
  getRowKey,
  emptyMessage = "No records found.",
  isRefreshing = false,
  viewLabel,
  viewIcon,
  editLabel,
  editIcon,
  deleteLabel,
  deleteIcon,
}: IManagementTable<T>) {
  // Determine if any actions are provided
  const hasActions = Boolean(onView || onEdit || onDelete);
  const columnCount = columns.length + (hasActions ? 1 : 0);
  const viewActionLabel = viewLabel ?? "View";
  const viewActionIcon = viewIcon ?? <Eye className="size-4" />;
  const editActionLabel = editLabel ?? "Edit";
  const editActionIcon = editIcon ?? <Pencil className="size-4" />;
  const deleteActionLabel = deleteLabel ?? "Delete";
  const deleteActionIcon = deleteIcon ?? (
    <Trash2 className="size-4 text-destructive focus:text-destructive" />
  );

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
            data?.map((row, rowIndex) => {
              // Allow parent to disable actions per row (e.g., status-based gating)
              const viewDisabled = isViewDisabled?.(row) ?? false;
              const editDisabled = isEditDisabled?.(row) ?? false;
              const deleteDisabled = isDeleteDisabled?.(row) ?? false;

              const viewClassName = viewDisabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer";
              const editClassName = editDisabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer";
              const deleteClassName = deleteDisabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer";

              return (
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
                              onClick={() => !viewDisabled && onView?.(row)}
                              className={viewClassName}
                              disabled={viewDisabled}
                            >
                              {viewActionIcon}
                              {viewActionLabel}
                            </DropdownMenuItem>
                          )}

                          {onEdit && (
                            <DropdownMenuItem
                              onClick={() => !editDisabled && onEdit?.(row)}
                              className={editClassName}
                              disabled={editDisabled}
                            >
                              {editActionIcon}
                              {editActionLabel}
                            </DropdownMenuItem>
                          )}

                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => !deleteDisabled && onDelete?.(row)}
                              className={deleteClassName}
                              disabled={deleteDisabled}
                            >
                              {deleteActionIcon}
                              {deleteActionLabel}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ManagementTable;
