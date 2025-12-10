import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ITableSkeleton {
  columns?: number;
  rows?: number;
  showActions?: boolean;
}

const TableSkeleton = ({
  columns = 6,
  rows = 10,
  showActions = true,
}: ITableSkeleton) => {
  const columnPlaceholders = Array.from({ length: columns });
  const rowPlaceholders = Array.from({ length: rows });

  return (
    <div className="relative overflow-hidden rounded-md border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columnPlaceholders.map((_, index) => (
              <TableHead key={`head-${index}`} className="whitespace-nowrap">
                <Skeleton className="h-4 w-full" />
              </TableHead>
            ))}

            {showActions && (
              <TableHead className="w-[72px] text-right">
                <Skeleton className="ml-auto h-4 w-12" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rowPlaceholders.map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {columnPlaceholders.map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <div className="flex items-center gap-2">
                    {colIndex === 0 && (
                      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    )}
                    <Skeleton className="h-4 w-full" />
                  </div>
                </TableCell>
              ))}

              {showActions && (
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;
