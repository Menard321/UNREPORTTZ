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
  verifiedOn,
  verificationNote,
  onReportProblem,
  className = "",
}) => {
  const isOfficial = status === "official_guideline" || status === "verified";
  const isDept = status === "department_template";
  const isSample = status === "student_sample" || status === "from_guideline_unverified_date" || status === "department_template_unverified_date";

  const getLabel = () => {
    switch (status) {
      case "official_guideline":
        return "Official Guideline";
      case "verified":
        return "Verified Template";
      case "department_template":
        return "Department Template";
      case "student_sample":
      case "student_sample_unverified":
        return "Student Sample Layout";
      default:
        return "Sample Layout";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={isOfficial ? "teal" : isDept ? "primary" : "secondary"}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold"
        >
          {isOfficial ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : isDept ? (
            <FileCheck className="w-3.5 h-3.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          )}
          <span>{getLabel()}</span>
          {verifiedOn && <span className="opacity-75">({verifiedOn})</span>}
        </Badge>

        {!isOfficial && onReportProblem && (
          <button
            type="button"
            onClick={onReportProblem}
            className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Report a problem
          </button>
        )}
      </div>

      {!isOfficial && (
        <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg p-2 flex items-center justify-between">
          <span>Sample layout until the template is verified.</span>
          {onReportProblem && (
            <button
              type="button"
              onClick={onReportProblem}
              className="font-bold underline text-amber-800 dark:text-amber-300 hover:text-amber-900"
            >
              Report a problem
            </button>
          )}
        </p>
      )}
    </div>
  );
};
