"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface SelectTableDataProps {
  paramName: string;
  placeholder?: string;
  options: { label: string; value: string }[];
}

const SelectTableData = ({
  paramName,
  placeholder,
  options,
}: SelectTableDataProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get current value from URL search params
  const currentValue = searchParams.get(paramName) || "All";

  // Handle selection change
  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove the param based on selection
    if (value === "All") {
      params.delete(paramName);
      params.delete("page");
    } else if (value) {
      params.set(paramName, value);
      params.set("page", "1");
    } else {
      params.delete(paramName);
      params.delete("page");
    }

    // Navigate with updated search params
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div>
      <Select
        value={currentValue}
        onValueChange={handleChange}
        disabled={isPending}
      >
        <SelectTrigger className="min-w-32 max-w-48">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectTableData;
