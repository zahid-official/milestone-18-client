"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

// Interface for IPagination
interface IPagination {
  currentPage: number;
  totalPages: number;
}

// PaginationFeature Component
const PaginationFeature = ({ currentPage, totalPages }: IPagination) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Update the page query param while staying in bounds
  const navigateToPage = (newPage: number) => {
    const nextPage = Math.min(Math.max(newPage, 1), totalPages);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());

    // Navigate with updated search params
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  // Don't render if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Show a maximum of 5 page buttons with a sliding window
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => {
      // Handle the case when currentPage is near the beginning
      if (totalPages <= 5 || currentPage <= 3) {
        return index + 1;
      }

      // Handle the case when currentPage is near the end
      if (currentPage >= totalPages - 2) {
        return totalPages - 4 + index;
      }

      // Handle the general case in the middle of the pagination range
      return currentPage - 2 + index;
    }
  );

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Prev control */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
      >
        <ChevronLeft className="h-4 w-4 -ml-0.5 -mr-0.5" />
        Prev
      </Button>

      {/* page window controls*/}
      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => navigateToPage(pageNumber)}
            disabled={isPending}
            className="w-10"
          >
            {pageNumber}
          </Button>
        ))}
      </div>

      {/* next control*/}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage >= totalPages || isPending}
        className=""
      >
        Next
        <ChevronRight className="h-4 w-4 -ml-0.5 -mr-0.5" />
      </Button>

      {/* current page indicator */}
      <span className="ml-2 text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default PaginationFeature;
