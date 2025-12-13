"use client";

import InfoRow from "@/components/modules/dashboard/managementPage/InfoRow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IProduct, IProductSpecifications } from "@/types/product.interface";
import { CheckCircle2, ClipboardList, Package, Ruler, Tag } from "lucide-react";
import Image from "next/image";

interface ProductDetailsViewDialogProps {
  open: boolean;
  onClose: () => void;
  product: IProduct | null;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatCategory = (category?: string) => {
  if (!category) return "Not specified";
  return category
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
};

const formatMaterials = (specs?: IProductSpecifications) => {
  const materials = specs?.materials ?? specs?.meterials;

  if (materials === undefined || materials === null) {
    return "Not specified";
  }

  if (Array.isArray(materials)) {
    const list = materials
      .filter((item) => typeof item === "string" && item.trim() !== "")
      .map((item) => item.trim())
      .join(", ");

    return list || "Not specified";
  }

  const text = String(materials).trim();
  return text.length ? text : "Not specified";
};

const formatWeight = (specs?: IProductSpecifications) => {
  if (!specs?.weight) return "Not specified";
  return `${specs.weight} kg`;
};

const ProductDetailsViewDialog = ({
  open,
  onClose,
  product,
}: ProductDetailsViewDialogProps) => {
  if (!product) {
    return null;
  }

  const specs = product.specifications;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[calc(100vh-3rem)] overflow-y-auto border-0 bg-background p-0 shadow-2xl">
        <DialogHeader className="sm:px-8 px-4 pt-8">
          <DialogTitle className="text-2xl font-semibold">
            Product Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-4 pb-5 sm:px-6 sm:pb-6">
          {/* Hero */}
          <div className="overflow-hidden rounded-xl border bg-muted shadow-sm">
            <div className="relative max-h-72 w-full from-muted to-background">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={1200}
                  height={900}
                  sizes="(min-width: 768px) 720px, 100vw"
                  className="h-72 w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-muted-foreground">
                  No thumbnail available
                </div>
              )}
            </div>
          </div>

          {/* Title row */}
          <div className="flex flex-wrap items-start gap-4 rounded-xl border bg-card/50 p-4 shadow-sm">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="inline-flex rounded items-center gap-2 bg-primary/10 px-3 py-1 text-primary">
                  <Tag className="size-4" />
                  {formatCategory(product.category)}
                </span>
              </div>

              <div>
                <h2 className="text-xl py-2 font-semibold leading-tight">
                  {product.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {product.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Price
              </p>
              <p className="text- font-bold text-primary">
                {currencyFormatter.format(product.price || 0)}
              </p>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold ${
                  product.stock > 0
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                <CheckCircle2 className="size-4" />
                Stock: {product.stock}
              </span>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4 rounded-xl border bg-card/50 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Ruler className="size-4 text-muted-foreground" />
              Specifications
            </div>
            <div className="grid gap-4 justify-center items-center grid-cols-2 lg:grid-cols-3">
              <InfoRow
                label="Category"
                value={formatCategory(product.category)}
              />
              <InfoRow
                label="Height"
                value={specs?.height ?? "Not specified"}
              />
              <InfoRow label="Width" value={specs?.width ?? "Not specified"} />
              <InfoRow
                label="Length"
                value={specs?.length ?? "Not specified"}
              />
              <InfoRow label="Weight" value={formatWeight(specs)} />
              <InfoRow label="Materials" value={formatMaterials(specs)} />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Package className="size-4 text-muted-foreground" />
                Short Description
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description || "No description provided."}
              </p>
            </div>

            <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <ClipboardList className="size-4 text-muted-foreground" />
                Product Overview
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.productOverview || "No overview provided."}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsViewDialog;
