import { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value?: string | number | ReactNode;
}

const InfoRow = ({ label, value }: InfoRowProps) => {
  const displayValue =
    value === null || value === undefined || value === "" ? "N/A" : value;

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold leading-relaxed wrap-break-word">
        {displayValue}
      </p>
    </div>
  );
};

export default InfoRow;
