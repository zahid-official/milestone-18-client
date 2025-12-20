"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useDebounce from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

// Interface for ISearch
interface ISearch {
  placeholder?: string;
  paramName?: string;
  className?: string;
}

// SearchFilter Component
const SearchFilter = ({
  placeholder = "Search...",
  paramName = "searchTerm",
  className,
}: ISearch) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) || "");
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const initialValue = searchParams.get(paramName) || "";

    // Rule-1: If the debounced value is the same as the initial value, do nothing
    if (debouncedValue === initialValue) {
      return;
    }

    // Rule-2: If there is a debounced value, set it in the params; otherwise, delete it
    if (debouncedValue) {
      params.set(paramName, debouncedValue);
      params.set("page", "1");
    } else {
      params.delete(paramName);
      params.delete("page");
    }

    // Rule-3: Navigate to the new URL with updated search params
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [debouncedValue, paramName, router, searchParams]);

  return (
    <div className={cn("relative w-full max-w-72", className)}>
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8 rounded-none"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={isPending}
        aria-label="Search table data"
      />
    </div>
  );
};

export default SearchFilter;
