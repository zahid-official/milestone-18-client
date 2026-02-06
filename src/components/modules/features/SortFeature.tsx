"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface SortOption {
  label: string;
  value: string;
}

// Interface for ISort
interface ISort {
  paramName: string;
  sortByParam?: string;
  orderParam?: string;
  valueSeparator?: string;
  placeholder?: string;
  defaultLabel?: string;
  options: SortOption[];
  className?: string;
  ariaLabel?: string;
}

// SortFilter Component
const SortFilter = ({
  paramName,
  sortByParam,
  orderParam,
  valueSeparator = ":",
  placeholder = "Sort by",
  defaultLabel,
  options,
  className,
  ariaLabel,
}: ISort) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const defaultOptionValue = "__default__";
  const defaultOptionLabel = defaultLabel || placeholder || "Default";
  const optionValues = new Set(options.map((option) => option.value));
  const useSplitParams = Boolean(sortByParam && orderParam);

  const resolveValue = (rawValue: string) =>
    rawValue === defaultOptionValue || optionValues.has(rawValue)
      ? rawValue
      : defaultOptionValue;

  const currentValue = (() => {
    if (useSplitParams) {
      const sortByValue = searchParams.get(sortByParam!) || "";
      const orderValue = searchParams.get(orderParam!) || "";

      if (!sortByValue) {
        return defaultOptionValue;
      }

      const combinedValue = orderValue
        ? `${sortByValue}${valueSeparator}${orderValue}`
        : sortByValue;

      return resolveValue(
        optionValues.has(combinedValue) ? combinedValue : sortByValue
      );
    }

    const rawValue = searchParams.get(paramName) || defaultOptionValue;
    return resolveValue(rawValue);
  })();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === defaultOptionValue) {
      if (!useSplitParams) {
        params.delete(paramName);
      }
      if (useSplitParams) {
        params.delete(sortByParam!);
        params.delete(orderParam!);
      }
      params.delete("page");
    } else if (value) {
      if (useSplitParams) {
        const [sortByValue, ...orderParts] = value.split(valueSeparator);
        const orderValue = orderParts.join(valueSeparator);

        if (sortByValue) {
          params.set(sortByParam!, sortByValue);
        } else {
          params.delete(sortByParam!);
        }

        if (orderValue) {
          params.set(orderParam!, orderValue);
        } else {
          params.delete(orderParam!);
        }
      } else {
        params.set(paramName, value);
      }
      params.set("page", "1");
    } else {
      if (!useSplitParams) {
        params.delete(paramName);
      }
      if (useSplitParams) {
        params.delete(sortByParam!);
        params.delete(orderParam!);
      }
      params.delete("page");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className={cn("", className)}>
      <Select
        value={currentValue}
        onValueChange={handleChange}
        disabled={isPending || options.length === 0}
      >
        <SelectTrigger
          className="min-w-36 max-w-56 rounded-none"
          aria-label={ariaLabel || placeholder || "Sort options"}
        >
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

export default SortFilter;
