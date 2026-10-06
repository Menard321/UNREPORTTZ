'use client';

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, School, GraduationCap, BookOpen, PlusCircle, Upload, CheckCircle2, HelpCircle } from "lucide-react";
import { SelectionParams } from "@/lib/profiles/resolve";

export interface CatalogInstitution {
  id: string;
  name: string;
  shortName: string;
  type: string;
  units: {
    id: string;
    name: string;
    shortName?: string;
    kind: string;
    departments: {
      id: string;
      name: string;
      programmes: {
        id: string;
        name: string;
        level: string;
        durationYears?: number;
      }[];
    }[];
  }[];
}

interface UniversitySelectorProps {
  catalog: CatalogInstitution[];
  value: SelectionParams;
  onChange: (newParams: SelectionParams) => void;
  onRequestUniversity?: () => void;
  onUploadFormat?: () => void;
}

export const UniversitySelector: React.FC<UniversitySelectorProps> = ({
  catalog,
  value,
  onChange,
  onRequestUniversity,
  onUploadFormat,
}) => {
  // Local state for "Not listed: type it" toggles
  const [isCustomInst, setIsCustomInst] = useState(false);
  const [isCustomUnit, setIsCustomUnit] = useState(false);
  const [isCustomDept, setIsCustomDept] = useState(false);
  const [isCustomProg, setIsCustomProg] = useState(false);

  // Selections
  const selectedInstObj = catalog.find(i => i.name === value.institutionName || i.shortName === value.institutionName);
  const selectedUnitObj = selectedInstObj?.units.find(u => u.name === value.unitName || u.shortName === value.unitName);
  
  // Flatten departments for selected unit
  const availableDepts = selectedUnitObj?.departments || [];

  // Flatten programmes for selected unit
  const availableProgs = availableDepts.flatMap(d => d.programmes.map(p => ({ ...p, departmentName: d.name })));

  const handleInstChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "CUSTOM") {
      setIsCustomInst(true);
      onChange({
        ...value,
        institutionName: "",
        unitName: "",
        departmentName: "",
        programmeName: "",
      });
    } else {
      setIsCustomInst(false);
      const inst = catalog.find(i => i.id === val);
      if (inst) {
        onChange({
          ...value,
          institutionName: inst.name,
          unitName: inst.units[0]?.name || "",
          departmentName: inst.units[0]?.departments[0]?.name || "",
          programmeName: inst.units[0]?.departments[0]?.programmes[0]?.name || "",
        });
      }
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "CUSTOM") {
      setIsCustomUnit(true);
      onChange({ ...value, unitName: "" });
    } else {
      setIsCustomUnit(false);
      const unit = selectedInstObj?.units.find(u => u.id === val);
      if (unit) {
        const firstDept = unit.departments[0];
        const firstProg = firstDept?.programmes[0];
        onChange({
          ...value,
          unitName: unit.name,
          departmentName: firstDept?.name || value.departmentName,
          programmeName: firstProg?.name || value.programmeName,
        });
      }
    }
  };

  const handleProgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "CUSTOM") {
      setIsCustomProg(true);
      onChange({ ...value, programmeName: "" });
    } else {
      setIsCustomProg(false);
      const prog = availableProgs.find(p => p.id === val);
      if (prog) {
        onChange({
          ...value,
          programmeName: prog.name,
          departmentName: prog.departmentName || value.departmentName,
          programmeLevel: prog.level || "bachelor",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Header Label */}
      <div>
        <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
          Select your university or college
        </label>
        <p className="text-xs text-slate-500">
          ReportWise auto-loads matching guidelines and dynamically formats your cover page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Institution Select */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-600" /> Institution / University
          </label>
          {!isCustomInst ? (
            <select
              value={selectedInstObj?.id || (value.institutionName ? "CUSTOM" : "")}
              onChange={handleInstChange}
              className="w-full h-11 px-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Institution --</option>
              {catalog.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.shortName})
                </option>
              ))}
              <option value="CUSTOM">-- Not listed: type it --</option>
            </select>
          ) : (
            <div className="space-y-1">
              <Input
                placeholder="Type your university or college name in full..."
                value={value.institutionName}
                onChange={(e) => onChange({ ...value, institutionName: e.target.value })}
                className="h-11"
              />
              <button
                type="button"
                onClick={() => setIsCustomInst(false)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← Back to list of institutions
              </button>
            </div>
          )}
        </div>

        {/* 2. College / School (Academic Unit) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-teal-600" /> College, School or Faculty
          </label>
          {!isCustomUnit && selectedInstObj && selectedInstObj.units.length > 0 ? (
            <select
              value={selectedUnitObj?.id || (value.unitName ? "CUSTOM" : "")}
              onChange={handleUnitChange}
              className="w-full h-11 px-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-teal-500"
            >
              <option value="">-- Choose College / School --</option>
              {selectedInstObj.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} {unit.shortName ? `(${unit.shortName})` : ''}
                </option>
              ))}
              <option value="CUSTOM">-- Not listed: type it --</option>
            </select>
          ) : (
            <div className="space-y-1">
              <Input
                placeholder="Type your college, school, or faculty name..."
                value={value.unitName}
                onChange={(e) => onChange({ ...value, unitName: e.target.value })}
                className="h-11"
              />
              {selectedInstObj && !isCustomUnit && (
                <button
                  type="button"
                  onClick={() => setIsCustomUnit(false)}
                  className="text-[11px] text-teal-600 hover:underline"
                >
                  ← Select from college list
                </button>
              )}
            </div>
          )}
        </div>

        {/* 3. Degree Course / Programme */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" /> Degree Course / Programme
          </label>
          {!isCustomProg && availableProgs.length > 0 ? (
            <select
              value={availableProgs.find(p => p.name === value.programmeName)?.id || (value.programmeName ? "CUSTOM" : "")}
              onChange={handleProgChange}
              className="w-full h-11 px-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select Degree Programme --</option>
              {availableProgs.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name}
                </option>
              ))}
              <option value="CUSTOM">-- Not listed: type it --</option>
            </select>
          ) : (
            <div className="space-y-1">
              <Input
                placeholder="Type full programme name e.g. Bachelor of Commerce in Marketing..."
                value={value.programmeName}
                onChange={(e) => onChange({ ...value, programmeName: e.target.value })}
                className="h-11"
              />
              {availableProgs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCustomProg(false)}
                  className="text-[11px] text-indigo-600 hover:underline"
                >
                  ← Choose from course dropdown
                </button>
              )}
            </div>
          )}
        </div>

        {/* 4. Department Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Department (without the word "Department")
          </label>
          <Input
            placeholder="e.g. Accounting, Computer Science, Marketing..."
            value={value.departmentName || ""}
            onChange={(e) => onChange({ ...value, departmentName: e.target.value })}
            className="h-11"
          />
        </div>
      </div>

      {/* Auxiliary actions: Request my university & Upload format */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <span className="text-slate-500">Can't find your exact format?</span>
        <div className="flex items-center gap-2">
          {onRequestUniversity && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRequestUniversity}
              icon={<PlusCircle className="w-3.5 h-3.5 text-blue-600" />}
            >
              Request my university
            </Button>
          )}
          {onUploadFormat && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onUploadFormat}
              icon={<Upload className="w-3.5 h-3.5 text-teal-600" />}
            >
              Upload my format
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
