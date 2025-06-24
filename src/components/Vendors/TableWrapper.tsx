import { ReactNode } from "react";

interface TableWrapperProps {
  children: ReactNode;
}

export function TableWrapper({ children }: TableWrapperProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      {children}
    </div>
  );
}