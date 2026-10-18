'use client';

import React, { useState } from "react";
import { CoverLine, ProfileType, ReportContext } from "@/lib/profiles/schema";
import { bindCoverLines, BoundCoverLine } from "@/lib/cover/bind";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Edit2, RotateCcw, Image as ImageIcon, CheckCircle2, Lock } from "lucide-react";
import catalogData from "@/data/catalog.json";

interface CoverPreviewProps {
  profile: ProfileType;
  context: ReportContext;
  overrides?: Record<string, string>;
  onOverrideChange?: (newOverrides: Record<string, string>) => void;
  uploadedLogoUrl?: string;
  onUploadLogo?: (file: File) => void;
}

export const CoverPreview: React.FC<CoverPreviewProps> = ({
  profile,
  context,
  overrides = {},
  onOverrideChange,
  uploadedLogoUrl,
  onUploadLogo,
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempOverrideVal, setTempOverrideVal] = useState<string>("");

  const coverConfig = profile.cover || { lines: [], border: "none" };
  const { boundLines, missingRequiredFields } = bindCoverLines(coverConfig.lines, context, overrides);

  // Auto-resolve official university logo from catalog.json
  const instNameLower = (context.institutionName || "").toLowerCase();
  const instList: any[] = Array.isArray(catalogData)
    ? catalogData
    : (catalogData as any)?.default && Array.isArray((catalogData as any).default)
    ? (catalogData as any).default
    : (catalogData as any)?.institutions || [];

  const matchedCatalogInst = instList.find(
    (inst: any) =>
      inst?.name?.toLowerCase() === instNameLower ||
      inst?.shortName?.toLowerCase() === instNameLower ||
      (instNameLower && inst?.shortName && instNameLower.includes(inst.shortName.toLowerCase())) ||
      (instNameLower && inst?.name && inst.name.toLowerCase().includes(instNameLower))
  );
  const effectiveLogoUrl = uploadedLogoUrl || matchedCatalogInst?.logoUrl;

  const handleStartOverride = (field: string, currentVal: string) => {
    setEditingField(field);
    setTempOverrideVal(currentVal.startsWith("[") && currentVal.endsWith("]") ? "" : currentVal);
  };

  const handleSaveOverride = (field: string) => {
    if (onOverrideChange) {
      onOverrideChange({
        ...overrides,
        [field]: tempOverrideVal,
      });
    }
    setEditingField(null);
  };

  const handleRevertOverride = (field: string) => {
    if (onOverrideChange) {
      const next = { ...overrides };
      delete next[field];
      onOverrideChange(next);
    }
  };

  // Determine frame border styling
  const getFrameStyle = () => {
    const border = (coverConfig.border || "none").toLowerCase();
    if (border.includes("double")) {
      return "border-4 border-double border-slate-900 dark:border-slate-100 p-8";
    }
    if (border.includes("thick") || border.includes("single")) {
      return "border-2 border-slate-900 dark:border-slate-100 p-8";
    }
    return "border border-slate-200 dark:border-slate-800 p-8 shadow-sm";
  };

  return (
    <div className="space-y-6">
      {/* Cover Details & Export Readiness Banner */}
      {missingRequiredFields.length > 0 ? (
        <Card className="p-4 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Cover details incomplete ({missingRequiredFields.length} missing)
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                The following fields are required to complete your university cover page and unlock document export:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {missingRequiredFields.map((field, idx) => (
                  <Badge key={idx} variant="outline" className="bg-amber-100 text-amber-900 text-[11px] font-semibold">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center gap-3 text-xs text-teal-900 dark:text-teal-200 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Cover details verified. Ready for dynamic export.</span>
        </div>
      )}

      {/* Live A4 Cover Page Container */}
      <div className="flex justify-center">
        <div
          className={`w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 rounded-sm relative flex flex-col justify-between font-serif transition-all ${getFrameStyle()}`}
          style={{ fontFamily: profile.formatting?.fontFamily || "Times New Roman, serif" }}
        >
          {/* Top & Middle Lines */}
          <div className="space-y-6 text-center my-auto py-6">
            {boundLines.map((line, idx) => {
              const isEditing = editingField === line.field;
              const hasOverride = line.field in overrides;

              // Parse line style rules
              const styleStr = line.style || "";
              const isBold = styleStr.includes("bold");
              const isRight = styleStr.includes("right");
              const isCenter = styleStr.includes("center") || (!isRight && !styleStr.includes("left"));
              const isLabelFill = styleStr.includes("label-fill");

              return (
                <div
                  key={idx}
                  className={`group relative transition-all rounded px-2 py-1 ${
                    line.hasMissingValue
                      ? "bg-amber-100/70 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-sans text-sm rounded border border-dashed border-amber-400"
                      : "hover:bg-blue-50/50"
                  }`}
                >
                  {/* Empty Logo Slot or Rendered Logo */}
                  {line.template === "" || line.field === "logo" ? (
                    <div className="my-4 flex flex-col items-center justify-center">
                      {effectiveLogoUrl ? (
                        <img
                          src={effectiveLogoUrl}
                          alt={`${context.institutionName || 'University'} Official Crest`}
                          className="h-28 w-auto max-w-[160px] object-contain mx-auto py-2"
                        />
                      ) : (
                        <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs p-2 text-center bg-slate-50">
                          <ImageIcon className="w-6 h-6 mb-1 text-slate-400" />
                          <span>Institution Logo Slot</span>
                        </div>
                      )}
                    </div>
                  ) : isEditing ? (
                    <div className="flex items-center gap-2 justify-center py-1">
                      <input
                        type="text"
                        value={tempOverrideVal}
                        onChange={(e) => setTempOverrideVal(e.target.value)}
                        className="border border-blue-500 rounded px-2 py-1 text-xs font-sans text-slate-900 w-full max-w-md focus:outline-none"
                        autoFocus
                      />
                      <Button size="sm" variant="primary" onClick={() => handleSaveOverride(line.field)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`leading-relaxed ${isBold ? "font-bold" : "font-normal"} ${
                        isRight ? "text-right" : isCenter ? "text-center" : "text-left"
                      }`}
                      style={{
                        fontSize: styleStr.includes("16pt")
                          ? "1.25rem"
                          : styleStr.includes("14pt")
                          ? "1.1rem"
                          : styleStr.includes("11pt")
                          ? "0.85rem"
                          : "0.95rem",
                      }}
                    >
                      {line.text}

                      {/* Manual Field Override indicator & action */}
                      {hasOverride && (
                        <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 font-sans px-1.5 py-0.5 rounded font-semibold inline-flex items-center gap-1">
                          Overridden
                          <button
                            type="button"
                            onClick={() => handleRevertOverride(line.field)}
                            className="hover:underline flex items-center gap-0.5 text-blue-700"
                            title="Revert to auto-bound token value"
                          >
                            <RotateCcw className="w-2.5 h-2.5" /> Revert
                          </button>
                        </span>
                      )}

                      {/* Inline edit trigger button on hover */}
                      {!line.hasMissingValue && onOverrideChange && !hasOverride && (
                        <button
                          type="button"
                          onClick={() => handleStartOverride(line.field, line.text)}
                          className="opacity-0 group-hover:opacity-100 ml-2 text-[10px] text-slate-400 hover:text-blue-600 font-sans transition-opacity"
                          title="Manual override value"
                        >
                          <Edit2 className="w-3 h-3 inline" /> Edit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer watermark */}
          <div className="text-center text-[10px] text-slate-400 font-sans py-2 border-t border-slate-100">
            A4 Standard Format • Auto-filled by ReportWise Context Engine
          </div>
        </div>
      </div>
    </div>
  );
};
