import { IColumn } from "@/components/modules/dashboard/managementPage/ManagementTable";
import { IProduct } from "@/types/product.interface";
import Image from "next/image";

// Format prices consistently in BDT
const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
});

// Truncate long strings to keep the table compact
const truncateText = (text: string, max = 45) =>
  text.length > max ? `${text.slice(0, max)}...` : text;

// Render a short overview/description snippet
const renderOverview = (product: IProduct) => {
  const text = product.productOverview || product.description;
  if (!text) return "-";
  const displayText = truncateText(text);

  return (
    <p className="line-clamp-2 text-sm text-muted-foreground" title={text}>
      {displayText}
    </p>
  );
};

// Render a short description snippet
const renderDescription = (product: IProduct) => {
  if (!product.description) return "-";
  const displayText = truncateText(product.description);

  return (
    <p
      className="line-clamp-2 text-sm text-muted-foreground"
      title={product.description}
    >
      {displayText}
    </p>
  );
};

// Render materials or fallback
const renderMaterials = (product: IProduct) => {
  const materials = product.specifications?.materials;
  const typoMaterials = product.specifications?.meterials;
  return materials || typoMaterials || "Not mentioned";
};

// Render specs (dimensions/weight) or fallback
const renderSpecs = (product: IProduct) => {
  const specs = product.specifications;
  if (!specs) return "No specs provided";

  const { width, length, height, weight } = specs;
  const dimensions =
    width || length || height
      ? [width, length, height]
          .map((value) => (value ? `${value}` : null))
          .filter(Boolean)
          .join(" × ") + " cm"
      : null;

  const weightText = weight ? `${weight} kg` : null;
  const parts = [dimensions, weightText].filter(Boolean);

  return parts.length ? parts.join(" • ") : "No specs provided";
};

// ProductColumns definition
const productColumns: IColumn<IProduct>[] = [
  {
    header: "Thumbnail",
    accessor: (product) =>
      product.thumbnail ? (
        <div className="relative h-10 w-10 object-cover overflow-hidden rounded-md">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-[10px] uppercase tracking-wide text-muted-foreground">
          No image
        </div>
      ),
    className: "w-[88px]",
  },
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Category",
    accessor: "category",
  },
  {
    header: "Description",
    accessor: (product) => renderDescription(product),
    className: "min-w-[200px]",
  },
  {
    header: "Overview",
    accessor: (product) => renderOverview(product),
    className: "min-w-[200px]",
  },
  {
    header: "Materials",
    accessor: (product) => renderMaterials(product),
    className: "min-w-[120px]",
  },
  {
    header: "Specifications",
    accessor: (product) => renderSpecs(product),
    className: "min-w-[160px]",
  },
  {
    header: "Price",
    accessor: (product) => currencyFormatter.format(product.price),
  },
  {
    header: "Stock",
    accessor: (product) => product.stock,
  },
];

export default productColumns;
