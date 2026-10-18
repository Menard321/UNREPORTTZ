import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, ShieldCheck, FileCheck, HelpCircle } from "lucide-react";

export interface ProfileStatusBadgeProps {
  status: string;
  verifiedOn?: string;
  verificationNote?: string;
  onReportProblem?: () => void;
  className?: string;
}

export const ProfileStatusBadge: React.FC<ProfileStatusBadgeProps> = ({
  status,
  verifiedOn = "2025/2026",
  verificationNote,
  onReportProblem,
  className = "",
}) => {
  const isOfficial = status === "official_guideline" || status === "verified";
  const isDept = status === "department_template";

  const getLabel = () => {
    switch (status) {
      case "official_guideline":
        return "Official Guideline (Verified)";
      case "verified":
        return "Verified Academic Template";
      case "department_template":
        return "Department Template";
      default:
        return "Standard University Template";
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge
        variant={isOfficial ? "teal" : isDept ? "primary" : "secondary"}
        className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold shadow-sm"
      >
        {isOfficial ? (
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        ) : isDept ? (
          <FileCheck className="w-3.5 h-3.5" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
        )}
        <span>{getLabel()}</span>
      </Badge>

      {onReportProblem && (
        <button
          type="button"
          onClick={onReportProblem}
          className="text-[11px] font-medium text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 ml-1"
        >
          <HelpCircle className="w-3.5 h-3.5" /> Report an issue
        </button>
      )}
    </div>
  );
};
