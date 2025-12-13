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
import {
  createProduct,
  updateProduct,
} from "@/services/vendor/productManagement";
import getFieldError from "@/utils/getFieldError";
import {
  IProduct,
  IProductSpecifications,
  ProductMaterials,
} from "@/types/product.interface";
import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface IProductFormDialog {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: IProduct | null;
}

// ProductFormDialog Component
const ProductFormDialog = ({
  open,
  onClose,
  onSuccess,
  product,
}: IProductFormDialog) => {
  // Switch between create and update flows based on whether a product is provided
  const isEdit = Boolean(product?._id);
  const [state, formAction, isPending] = useActionState(
    isEdit ? updateProduct.bind(null, product!._id!) : createProduct,
    null
  );
  const [clientFileError, setClientFileError] = useState<string | null>(null);
  const MAX_FILE_BYTES = 4.5 * 1024 * 1024;

  // Handle action state side effects
  useHandleActionState(state);

  // Close dialog and bubble success back to parent when submission succeeds
  useEffect(() => {
    if (!state?.success) return;
    onSuccess();
    onClose();
  }, [state, onClose, onSuccess]);

  // Prevent submitting oversized files before the request reaches the server
  const handleSubmit = async (formData: FormData) => {
    setClientFileError(null);
    const file = formData.get("file");

    if (file instanceof File && file.size > MAX_FILE_BYTES) {
      setClientFileError("Image must be 4.5MB or smaller.");
      return;
    }

    // Skip calling the API if nothing changed (better UX + fewer calls)
    if (isEdit && product) {
      const parseNumber = (value: FormDataEntryValue | null) => {
        if (typeof value === "string" && value.trim() !== "") {
          const parsed = Number(value);
          return Number.isNaN(parsed) ? undefined : parsed;
        }
        return undefined;
      };
      const getTextValue = (value: FormDataEntryValue | null) =>
        typeof value === "string" && value.trim().length > 0
          ? value.trim()
          : undefined;

      const materials = formData.get("materials");
      const specsFromForm: IProductSpecifications = {
        height: parseNumber(formData.get("height")),
        weight: parseNumber(formData.get("weight")),
        width: parseNumber(formData.get("width")),
        length: parseNumber(formData.get("length")),
        materials:
          typeof materials === "string" && materials.trim().length > 0
            ? (materials.trim() as ProductMaterials)
            : undefined,
      };
      const hasSpecs = Object.values(specsFromForm).some(
        (value) => value !== undefined
      );

      const payloadFromForm = {
        title: getTextValue(formData.get("title")),
        price: parseNumber(formData.get("price")),
        stock: parseNumber(formData.get("stock")),
        category: getTextValue(formData.get("category")),
        description: getTextValue(formData.get("description")),
        productOverview: getTextValue(formData.get("productOverview")),
        specifications: hasSpecs ? specsFromForm : undefined,
      };

      const normalizeSpecs = (specs?: IProduct["specifications"]) => ({
        height: specs?.height ?? undefined,
        weight: specs?.weight ?? undefined,
        width: specs?.width ?? undefined,
        length: specs?.length ?? undefined,
        materials:
          specs?.materials ??
          (specs?.meterials as ProductMaterials | undefined) ??
          undefined,
      });

      const originalSpecs = normalizeSpecs(product.specifications);
      const currentSpecs = normalizeSpecs(payloadFromForm.specifications);

      const specsChanged = Object.keys(currentSpecs).some((key) => {
        const k = key as keyof typeof currentSpecs;
        return currentSpecs[k] !== originalSpecs[k];
      });

      const fieldsChanged = [
        payloadFromForm.title !== undefined &&
          payloadFromForm.title !== product.title,
        payloadFromForm.price !== undefined &&
          payloadFromForm.price !== product.price,
        payloadFromForm.stock !== undefined &&
          payloadFromForm.stock !== product.stock,
        payloadFromForm.category !== undefined &&
          payloadFromForm.category !== product.category,
        payloadFromForm.description !== undefined &&
          payloadFromForm.description !== product.description,
        payloadFromForm.productOverview !== undefined &&
          payloadFromForm.productOverview !== product.productOverview,
        payloadFromForm.specifications !== undefined && specsChanged,
        file instanceof File && file.size > 0,
      ].some(Boolean);

      if (!fieldsChanged) {
        toast.warning("No changes to update.");
        return;
      }
    }

    return formAction(formData);
  };

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
          <DialogTitle className="pb-2">
            {isEdit ? "Update Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        {/* Product form handles both create and update */}
        <form action={handleSubmit} className="space-y-5">
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
                    defaultValue={product?.title}
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "title")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="file">
                  Upload Thumbnail{" "}
                  {!isEdit && (
                    <span className="text-destructive" aria-hidden="true">
                      *
                    </span>
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="image/*"
                    disabled={isPending}
                  />
                  <FieldError>
                    {clientFileError ?? getFieldError(state, "file")}
                  </FieldError>
                  {isEdit && (
                    <p className="text-xs text-muted-foreground">
                      Leave blank to keep the current thumbnail.
                    </p>
                  )}
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
                    defaultValue={product?.price}
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
                    defaultValue={product?.stock}
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
                    defaultValue={product?.category || ""}
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
                    defaultValue={
                      product?.specifications?.materials ||
                      (product?.specifications?.meterials as
                        | string
                        | undefined) ||
                      ""
                    }
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
                    defaultValue={product?.specifications?.height}
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
                    defaultValue={product?.specifications?.width}
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
                    defaultValue={product?.specifications?.length}
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
                    defaultValue={product?.specifications?.weight}
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
                    defaultValue={product?.description}
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
                    defaultValue={product?.productOverview}
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
                isEdit ? "Update Product" : "Save Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
