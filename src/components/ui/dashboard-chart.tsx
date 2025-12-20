"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";

export const description = "An interactive area chart";

export type DashboardChartDatum = Record<string, number | string | Date>;

export type DashboardChartRange = {
  value: string;
  label: string;
  shortLabel?: string;
  days: number;
};

export type DashboardChartSeries = {
  dataKey: string;
  type?: React.ComponentProps<typeof Area>["type"];
  stackId?: string;
  stroke?: string;
  fill?: string;
  gradientStops?: Array<{ offset: string; opacity: number }>;
};

export interface DashboardChartProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  descriptionShort?: React.ReactNode;
  data?: DashboardChartDatum[];
  config?: ChartConfig;
  series?: DashboardChartSeries[];
  xKey?: string;
  ranges?: DashboardChartRange[];
  defaultRange?: string;
  mobileRange?: string;
  referenceDate?: Date | string;
  dateLocale?: string;
  dateFormatOptions?: Intl.DateTimeFormatOptions;
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>["content"];
  tooltipContentProps?: React.ComponentProps<typeof ChartTooltipContent>;
  tooltipProps?: Omit<React.ComponentProps<typeof ChartTooltip>, "content">;
  tooltipFields?: Array<{
    key: string;
    label: string;
    format?: "number" | "currency";
  }>;
  tooltipLocale?: string;
  tooltipCurrency?: string;
  cardClassName?: string;
  contentClassName?: string;
  chartClassName?: string;
  animate?: boolean;
}

type DashboardChartTooltipFormatter = NonNullable<
  React.ComponentProps<typeof ChartTooltipContent>["formatter"]
>;

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const defaultDescription = "Total for the last 3 months";
const defaultDescriptionShort = "Last 3 months";
const defaultDateFormatOptions: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
};

const defaultRanges: DashboardChartRange[] = [
  {
    value: "90d",
    label: "Last 3 months",
    shortLabel: "Last 3 months",
    days: 90,
  },
  { value: "30d", label: "Last 30 days", shortLabel: "Last 30 days", days: 30 },
  { value: "7d", label: "Last 7 days", shortLabel: "Last 7 days", days: 7 },
];

const defaultSeries: DashboardChartSeries[] = [
  {
    dataKey: "mobile",
    type: "natural",
    stackId: "a",
    gradientStops: [
      { offset: "5%", opacity: 0.8 },
      { offset: "95%", opacity: 0.1 },
    ],
  },
  {
    dataKey: "desktop",
    type: "natural",
    stackId: "a",
    gradientStops: [
      { offset: "5%", opacity: 1 },
      { offset: "95%", opacity: 0.1 },
    ],
  },
];

// DashboardChartUI Component
const DashboardChartUI = ({
  title = "Total Visitors",
  description: chartDescription = defaultDescription,
  descriptionShort,
  data = [],
  config = chartConfig,
  series = defaultSeries,
  xKey = "date",
  ranges = defaultRanges,
  defaultRange = "7d",
  mobileRange,
  referenceDate,
  dateLocale = "en-US",
  dateFormatOptions,
  tooltipContent,
  tooltipContentProps,
  tooltipProps,
  tooltipFields,
  tooltipLocale = "en-US",
  tooltipCurrency = "USD",
  cardClassName,
  contentClassName,
  chartClassName,
  animate = false,
}: DashboardChartProps) => {
  const isMobile = useIsMobile();
  const initialRange =
    ranges.find((range) => range.value === defaultRange)?.value ||
    ranges[0]?.value;
  const [timeRange, setTimeRange] = React.useState(initialRange);

  React.useEffect(() => {
    const nextRange = ranges[0]?.value;
    if (timeRange && ranges.some((range) => range.value === timeRange)) {
      return;
    }
    if (nextRange && nextRange !== timeRange) {
      setTimeRange(nextRange);
    }
  }, [ranges, timeRange]);

  React.useEffect(() => {
    const nextRange = mobileRange || ranges[ranges.length - 1]?.value;
    if (isMobile && nextRange && nextRange !== timeRange) {
      setTimeRange(nextRange);
    }
  }, [isMobile, mobileRange, ranges, timeRange]);

  const getReferenceDate = React.useCallback(() => {
    if (referenceDate) {
      const parsedDate = new Date(referenceDate);
      return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    let latestTime = 0;
    data.forEach((item) => {
      const value = item[xKey];
      const itemDate = new Date(value);
      const time = itemDate.getTime();
      if (!Number.isNaN(time) && time > latestTime) {
        latestTime = time;
      }
    });

    return latestTime ? new Date(latestTime) : null;
  }, [data, referenceDate, xKey]);

  const filteredData = React.useMemo(() => {
    if (!ranges.length || !timeRange) {
      return data;
    }

    const activeRange = ranges.find((range) => range.value === timeRange);
    const reference = getReferenceDate();

    if (!activeRange || !reference) {
      return data;
    }

    const startDate = new Date(reference);
    startDate.setDate(startDate.getDate() - activeRange.days);

    return data.filter((item) => {
      const date = new Date(item[xKey]);
      if (Number.isNaN(date.getTime())) {
        return false;
      }
      return date >= startDate;
    });
  }, [data, getReferenceDate, ranges, timeRange, xKey]);

  const dateFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(
        dateLocale,
        dateFormatOptions || defaultDateFormatOptions
      ),
    [dateLocale, dateFormatOptions]
  );
  const formatDate = React.useCallback(
    (value: string | number) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return String(value);
      }

      return dateFormatter.format(date);
    },
    [dateFormatter]
  );

  const numberFormatter = React.useMemo(
    () => new Intl.NumberFormat(tooltipLocale),
    [tooltipLocale]
  );
  const currencyFormatter = React.useMemo(
    () =>
      new Intl.NumberFormat(tooltipLocale, {
        style: "currency",
        currency: tooltipCurrency,
      }),
    [tooltipLocale, tooltipCurrency]
  );
  const formatTooltipValue = React.useCallback(
    (value: unknown, format?: "number" | "currency") => {
      if (typeof value === "number") {
        if (format === "currency") {
          return currencyFormatter.format(value);
        }
        if (format === "number") {
          return numberFormatter.format(value);
        }
      }

      const asNumber = typeof value === "string" ? Number(value) : NaN;
      if (!Number.isNaN(asNumber)) {
        if (format === "currency") {
          return currencyFormatter.format(asNumber);
        }
        if (format === "number") {
          return numberFormatter.format(asNumber);
        }
      }

      return String(value ?? "");
    },
    [currencyFormatter, numberFormatter]
  );

  const tooltipFormatter = React.useCallback<DashboardChartTooltipFormatter>(
    (_value, _name, item, index) => {
      if (!tooltipFields?.length || index !== 0) {
        return null;
      }

      const payload =
        item && typeof item === "object" && "payload" in item
          ? (item.payload as Record<string, unknown>)
          : undefined;

      if (!payload) {
        return null;
      }

      const rows = tooltipFields
        .map((field) => {
          const rawValue = payload[field.key];
          if (rawValue === undefined || rawValue === null) {
            return null;
          }

          return (
            <div
              key={field.key}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-xs text-muted-foreground">
                {field.label}
              </span>
              <span className="text-xs text-foreground font-medium tabular-nums">
                {formatTooltipValue(rawValue, field.format)}
              </span>
            </div>
          );
        })
        .filter(Boolean);

      if (!rows.length) {
        return null;
      }

      return <div className="grid gap-1.5 text-xs">{rows}</div>;
    },
    [formatTooltipValue, tooltipFields]
  );

  const {
    className: tooltipClassNameProp,
    labelClassName: tooltipLabelClassNameProp,
    ...restTooltipContentProps
  } = tooltipContentProps || {};

  const defaultTooltipContent = (
    <ChartTooltipContent
      indicator="dot"
      labelFormatter={(value) => formatDate(value as string | number)}
      formatter={tooltipFields?.length ? tooltipFormatter : undefined}
      {...restTooltipContentProps}
      className={cn("text-xs", tooltipClassNameProp)}
      labelClassName={cn("text-xs", tooltipLabelClassNameProp)}
    />
  );
  const shortDescription =
    descriptionShort ??
    (chartDescription === defaultDescription
      ? defaultDescriptionShort
      : undefined);

  return (
    <Card className={cn("@container/card", cardClassName)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {chartDescription !== undefined && chartDescription !== null && (
          <CardDescription>
            {shortDescription ? (
              <>
                <span className="hidden @[540px]/card:block">
                  {chartDescription}
                </span>
                <span className="@[540px]/card:hidden">{shortDescription}</span>
              </>
            ) : (
              chartDescription
            )}
          </CardDescription>
        )}

        {ranges.length > 0 && (
          <CardAction>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => value && setTimeRange(value)}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              {ranges.map((range) => (
                <ToggleGroupItem key={range.value} value={range.value}>
                  {range.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <Select
              value={timeRange}
              onValueChange={(value) => value && setTimeRange(value)}
            >
              <SelectTrigger
                className="flex w-34 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder={ranges[0]?.label} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {ranges.map((range) => (
                  <SelectItem
                    key={range.value}
                    value={range.value}
                    className="rounded-lg"
                  >
                    {range.shortLabel || range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardAction>
        )}
      </CardHeader>

      {/* Card content */}
      <CardContent
        className={cn("px-2 pt-4 sm:px-6 sm:pt-6", contentClassName)}
      >
        <ChartContainer
          config={config}
          className={cn("aspect-auto h-[250px] w-full", chartClassName)}
        >
          {/* Chart */}
          <AreaChart data={filteredData}>
            <defs>
              {series.map((item) => {
                if (item.fill) {
                  return null;
                }

                const gradientId = `fill-${item.dataKey.replace(
                  /[^a-zA-Z0-9_-]/g,
                  ""
                )}`;
                const stops = item.gradientStops || [
                  { offset: "5%", opacity: 0.8 },
                  { offset: "95%", opacity: 0.1 },
                ];

                return (
                  <linearGradient
                    key={item.dataKey}
                    id={gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    {stops.map((stop) => (
                      <stop
                        key={stop.offset}
                        offset={stop.offset}
                        stopColor={`var(--color-${item.dataKey})`}
                        stopOpacity={stop.opacity}
                      />
                    ))}
                  </linearGradient>
                );
              })}
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatDate(value)}
            />
            <ChartTooltip
              cursor={false}
              content={tooltipContent ?? defaultTooltipContent}
              {...tooltipProps}
            />
            {series.map((item) => {
              const gradientId = `fill-${item.dataKey.replace(
                /[^a-zA-Z0-9_-]/g,
                ""
              )}`;
              const fill = item.fill || `url(#${gradientId})`;
              const stroke = item.stroke || `var(--color-${item.dataKey})`;

              return (
                <Area
                  key={item.dataKey}
                  dataKey={item.dataKey}
                  type={item.type || "natural"}
                  fill={fill}
                  stroke={stroke}
                  stackId={item.stackId}
                  isAnimationActive={animate}
                />
              );
            })}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardChartUI;
