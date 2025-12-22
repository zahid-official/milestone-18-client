import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export interface DashboardCardProps {
  description: string;
  value: string;
  badgeText?: string;
  badgeIcon?: LucideIcon;
  footerText?: string;
  footerSubText?: string;
}

// DashboardCardUI Component
const DashboardCardUI = ({
  description,
  value,
  badgeText,
  badgeIcon: BadgeIcon,
  footerText,
  footerSubText,
}: DashboardCardProps) => {
  return (
    <div>
      <Card className="@container/card gap-3">
        <CardHeader>
          <CardDescription>{description}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {value}
          </CardTitle>
          {badgeText && (
            <CardAction>
              <Badge variant="outline">
                {BadgeIcon && <BadgeIcon className="size-4" />}
                {badgeText}
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        {(footerText || footerSubText) && (
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {footerText && (
              <div className="line-clamp-1 flex gap-2 font-medium">
                {footerText}
              </div>
            )}
            {footerSubText && (
              <div className="text-muted-foreground">{footerSubText}</div>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default DashboardCardUI;
