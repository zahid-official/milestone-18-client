"use client";
import { Button } from "@/components/ui/button";
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
import { Spinner } from "@/components/ui/spinner";
import { productCategory, productMaterials } from "@/constants/productCategory";
import useHandleActionState from "@/hooks/useHandleActionState";
import { createProduct } from "@/services/vendor/productManagement";
import getFieldError from "@/utils/getFieldError";
import { useActionState, useEffect, useMemo } from "react";

interface IProductFormDialog {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ProductFormDialog Component
const ProductFormDialog = ({
  open,
  onClose,
  onSuccess,
}: IProductFormDialog) => {
  const [state, formAction, isPending] = useActionState(createProduct, null);

  // Handle action state side effects
  useHandleActionState(state);

  // Close dialog and bubble success back to parent when creation succeeds
  useEffect(() => {
    if (!state?.success) return;
    onSuccess();
    onClose();
  }, [state, onClose, onSuccess]);

  // Map enum values to human-friendly labels for the select fields
  const materialOptions = useMemo(
    () =>
      Object.values(productMaterials).map((material) => ({
        value: material,
        label: material.charAt(0) + material.slice(1).toLowerCase(),
      })),
    []
  );
  const categoryOptions = useMemo(
    () =>
      Object.values(productCategory).map((category) => ({
        value: category,
        label: category
          .split("_")
          .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
          .join(" "),
      })),
    []
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-w-[calc(100%-1.5rem)] max-h-[calc(100vh-2rem)] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="pb-2">Add New Product</DialogTitle>
        </DialogHeader>

        {/* Product create form */}
        <form action={formAction} className="space-y-5">
          <FieldSet>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Title and thumbnail side-by-side */}
              <Field>
                <FieldLabel htmlFor="title">
                  Title{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Ergonomic office chair"
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "title")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="file">
                  Upload Thumbnail{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="image/*"
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "file")}</FieldError>
                </FieldContent>
              </Field>
            </div>

            {/* Price and stock side-by-side */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="price">
                  Price{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="199.99"
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "price")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="stock">
                  Stock{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="20"
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "stock")}</FieldError>
                </FieldContent>
              </Field>
            </div>

            {/* Category and materials side-by-side */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="category">
                  Category{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <select
                    id="category"
                    name="category"
                    className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue=""
                    disabled={isPending}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError>{getFieldError(state, "category")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="materials">Materials</FieldLabel>
                <FieldContent>
                  <select
                    id="materials"
                    name="materials"
                    className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue=""
                    disabled={isPending}
                  >
                    <option value="" disabled>
                      Select material
                    </option>
                    {materialOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError>{getFieldError(state, "materials")}</FieldError>
                </FieldContent>
              </Field>
            </div>

            {/* Specs grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="height">Height (cm)</FieldLabel>
                <FieldContent>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="45"
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "height")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="width">Width (cm)</FieldLabel>
                <FieldContent>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="60"
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "width")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="length">Length (cm)</FieldLabel>
                <FieldContent>
                  <Input
                    id="length"
                    name="length"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="120"
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "length")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="weight">Weight (kg)</FieldLabel>
                <FieldContent>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="8.5"
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "weight")}</FieldError>
                </FieldContent>
              </Field>
            </div>

            {/* Short description and product overview side-by-side */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="description">
                  Short Description{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Summarize the product in a few sentences"
                    className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "description")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="productOverview">
                  Product Overview
                </FieldLabel>
                <FieldContent>
                  <textarea
                    id="productOverview"
                    name="productOverview"
                    placeholder="Add rich details, materials, and usage recommendations"
                    className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isPending}
                  />
                  <FieldError>
                    {getFieldError(state, "productOverview")}
                  </FieldError>
                </FieldContent>
              </Field>
            </div>
          </FieldSet>

          {/* Buttons */}
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
              ) : (
                "Save Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
