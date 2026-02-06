"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import useHandleActionState from "@/hooks/useHandleActionState";
import { createCoupon, updateCoupon } from "@/services/coupon/couponManagement";
import { ICoupon } from "@/types";
import getFieldError from "@/utils/getFieldError";
import { ChevronDownIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

interface CouponManagementFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  coupon?: ICoupon | null;
}

const discountTypeOptions = [
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "FIXED", label: "Fixed amount" },
];

// Parse ISO/date-like strings into Date (safe for YYYY-MM-DD and ISO timestamps).
const parseDateValue = (value?: string) => {
  if (!value) return undefined;
  const match = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    return new Date(year, month, day);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

// Serialize Date into YYYY-MM-DD for backend payload.
const formatDateForPayload = (value?: Date) => {
  if (!value) return "";
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Human-friendly label for picker button.
const formatDisplayDate = (value?: Date) => {
  if (!value) return "Select date";
  return value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// CouponManagementFormDialog Component
const CouponManagementFormDialog = ({
  open,
  onClose,
  onSuccess,
  coupon,
}: CouponManagementFormDialogProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isEdit = Boolean(coupon?._id);
  const [state, formAction, isPending] = useActionState(
    isEdit ? updateCoupon.bind(null, coupon!._id!) : createCoupon,
    null
  );
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [selectedDiscountType, setSelectedDiscountType] = useState(
    coupon?.discountType ?? ""
  );
  const [startDate, setStartDate] = useState<Date | undefined>(() =>
    parseDateValue(coupon?.startDate)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(() =>
    parseDateValue(coupon?.endDate)
  );

  useHandleActionState(state);

  useEffect(() => {
    if (!state?.success) return;
    onSuccess();
    onClose();
  }, [state, onClose, onSuccess]);

  const activeDefaultValue =
    coupon?.isActive === true
      ? "true"
      : coupon?.isActive === false
      ? "false"
      : "true";

  // Keep start/end within allowed range: today or later; end can't be before start.
  const maxStartDate = endDate && endDate >= today ? endDate : undefined;
  const minEndDate = startDate && startDate > today ? startDate : today;
  const startDisabled = maxStartDate
    ? [{ before: today }, { after: maxStartDate }]
    : { before: today };
  const endDisabled = { before: minEndDate };

  const handleStartDateSelect = (value?: Date) => {
    setStartDate(value);
    if (value && endDate && value > endDate) {
      setEndDate(value);
    }
    setStartOpen(false);
  };

  const handleEndDateSelect = (value?: Date) => {
    setEndDate(value);
    if (value && startDate && value < startDate) {
      setStartDate(value);
    }
    setEndOpen(false);
  };

  // Max discount only applies to percentage discounts.
  const isFixedDiscount = selectedDiscountType === "FIXED";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-w-[calc(100%-1.5rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pb-2">
            {isEdit ? "Update Coupon" : "Create Coupon"}
          </DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          <FieldSet>
            {/* Code + title */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="code">
                  Code{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="code"
                    name="code"
                    placeholder="SUMMER25"
                    defaultValue={coupon?.code}
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "code")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <FieldContent>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Summer savings"
                    defaultValue={coupon?.title}
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "title")}</FieldError>
                </FieldContent>
              </Field>
            </div>

            {/* Discount type + value */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="discountType">
                  Discount Type{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <select
                    id="discountType"
                    name="discountType"
                    className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedDiscountType}
                    onChange={(event) =>
                      setSelectedDiscountType(event.target.value)
                    }
                    disabled={isPending}
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    {discountTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError>
                    {getFieldError(state, "discountType")}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="discountValue">
                  Discount Value{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="10"
                    defaultValue={
                      coupon?.discountValue !== undefined
                        ? coupon.discountValue
                        : undefined
                    }
                    disabled={isPending}
                  />
                  <FieldError>
                    {getFieldError(state, "discountValue")}
                  </FieldError>
                </FieldContent>
              </Field>
            </div>

            {/* Coupon validity range */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="startDate">
                  Start Date{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <input
                    name="startDate"
                    type="hidden"
                    value={formatDateForPayload(startDate)}
                  />
                  <Popover open={startOpen} onOpenChange={setStartOpen}>
                    <PopoverTrigger asChild>
                      <div
                        className={`relative w-full ${
                          isPending ? "pointer-events-none" : ""
                        }`}
                      >
                        <Input
                          id="startDate"
                          readOnly
                          value={
                            startDate ? formatDisplayDate(startDate) : ""
                          }
                          placeholder="Select date"
                          className="pr-8 cursor-pointer focus-visible:ring-0 focus-visible:border-input"
                          disabled={isPending}
                        />
                        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        defaultMonth={startDate ?? today}
                        selected={startDate}
                        onSelect={handleStartDateSelect}
                        disabled={startDisabled}
                        className="rounded-lg border shadow-sm"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldError>{getFieldError(state, "startDate")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="endDate">
                  End Date{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <input
                    name="endDate"
                    type="hidden"
                    value={formatDateForPayload(endDate)}
                  />
                  <Popover open={endOpen} onOpenChange={setEndOpen}>
                    <PopoverTrigger asChild>
                      <div
                        className={`relative w-full ${
                          isPending ? "pointer-events-none" : ""
                        }`}
                      >
                        <Input
                          id="endDate"
                          readOnly
                          value={endDate ? formatDisplayDate(endDate) : ""}
                          placeholder="Select date"
                          className="pr-8 cursor-pointer focus-visible:ring-0 focus-visible:border-input"
                          disabled={isPending}
                        />
                        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        defaultMonth={endDate ?? startDate ?? today}
                        selected={endDate}
                        onSelect={handleEndDateSelect}
                        disabled={endDisabled}
                        className="rounded-lg border shadow-sm"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldError>{getFieldError(state, "endDate")}</FieldError>
                </FieldContent>
              </Field>
            </div>

            {/* Limits on discount and order total */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="maxDiscount">Max Discount</FieldLabel>
                <FieldContent>
                  <Input
                    id="maxDiscount"
                    name="maxDiscount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={
                      isFixedDiscount ? "Not used for fixed discounts" : "50"
                    }
                    defaultValue={
                      coupon?.maxDiscount !== undefined
                        ? coupon.maxDiscount
                        : undefined
                    }
                    disabled={isPending || isFixedDiscount}
                  />
                  <FieldError>{getFieldError(state, "maxDiscount")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="minOrderAmount">
                  Minimum Order Amount
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="minOrderAmount"
                    name="minOrderAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="100"
                    defaultValue={
                      coupon?.minOrderAmount !== undefined
                        ? coupon.minOrderAmount
                        : undefined
                    }
                    disabled={isPending}
                  />
                  <FieldError>
                    {getFieldError(state, "minOrderAmount")}
                  </FieldError>
                </FieldContent>
              </Field>
            </div>

            {/* Quantity/usage constraints */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="minQuantity">Minimum Quantity</FieldLabel>
                <FieldContent>
                  <Input
                    id="minQuantity"
                    name="minQuantity"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="2"
                    defaultValue={
                      coupon?.minQuantity !== undefined
                        ? coupon.minQuantity
                        : undefined
                    }
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "minQuantity")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="usageLimit">Usage Limit</FieldLabel>
                <FieldContent>
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="100"
                    defaultValue={
                      coupon?.usageLimit !== undefined
                        ? coupon.usageLimit
                        : undefined
                    }
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "usageLimit")}</FieldError>
                </FieldContent>
              </Field>
            </div>

            {/* Active/inactive toggle */}
            <Field>
              <FieldLabel htmlFor="isActive">Status</FieldLabel>
              <FieldContent>
                <select
                  id="isActive"
                  name="isActive"
                  className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={activeDefaultValue}
                  disabled={isPending}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <FieldError>{getFieldError(state, "isActive")}</FieldError>
              </FieldContent>
            </Field>

            {/* Optional description */}
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <FieldContent>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the discount, limitations, and eligibility."
                  className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={coupon?.description}
                  disabled={isPending}
                />
                <FieldError>{getFieldError(state, "description")}</FieldError>
              </FieldContent>
            </Field>
          </FieldSet>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Coupon"
              ) : (
                "Create Coupon"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CouponManagementFormDialog;
