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

// Interface for ISelect
interface ISelect {
  paramName: string;
  placeholder?: string;
  defaultLabel?: string;
  options: { label: string; value: string }[];
}

// SelectFilter Component
const SelectFilter = ({
  paramName,
  placeholder,
  defaultLabel,
  options,
}: ISelect) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const defaultOptionValue = "__all__";
  const defaultOptionLabel = defaultLabel || placeholder || "All";

  // Get current value from URL search params
  const currentValue = searchParams.get(paramName) || defaultOptionValue;

  // Handle selection change
  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove the param based on selection
    if (value === defaultOptionValue) {
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
        <SelectTrigger className="min-w-32 max-w-48 rounded-none">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={defaultOptionValue}>
            {defaultOptionLabel}
          </SelectItem>
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

export default SelectFilter;
