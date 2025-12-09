"use client";
import React from "react";
import { Plus, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

// Interface for table header
export interface IManagementTableHeader {
  title: string;
  description?: string;
  action?: {
    icon?: LucideIcon;
    label: string;
    onClick?: () => void;
  };
  children?: React.ReactNode;
}

// TableHeader Component
const ManagementTableHeader = ({
  title,
  description,
  action,
  children,
}: IManagementTableHeader) => {
  const Icon = action?.icon ?? Plus;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
      {/* Copy block */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold leading-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Actions area */}
      <div className="flex items-center justify-center min-w-2 gap-2">
        {children}
        {action?.label && (
          <Button
            onClick={action?.onClick}
            className="flex items-center justify-center"
          >
            <Icon className="-ml-1 -mr-1" />
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ManagementTableHeader;
