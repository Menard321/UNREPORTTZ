'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_UNIVERSITIES, MOCK_COLLEGES, MOCK_DEPARTMENTS, MOCK_PROGRAMMES } from '@/lib/data/mock-data';
import { University, College, Department, Programme } from '@/types';
import { Building2, BookOpen, GraduationCap, Calendar } from 'lucide-react';

interface UniversityAcademicSelectsProps {
  selectedUniversityId?: string;
  onUniversityChange?: (uniId: string) => void;
  onCollegeChange?: (collegeId: string) => void;
  onDepartmentChange?: (deptId: string) => void;
  onProgrammeChange?: (programmeName: string) => void;
  onYearChange?: (year: string) => void;
  initialValues?: {
    universityId?: string;
    collegeId?: string;
    departmentId?: string;
    programmeName?: string;
    yearOfStudy?: string;
  };
}

export function UniversityAcademicSelects({
  selectedUniversityId,
  onUniversityChange,
  onCollegeChange,
  onDepartmentChange,
  onProgrammeChange,
  onYearChange,
  initialValues = {},
}: UniversityAcademicSelectsProps) {
  const [universityId, setUniversityId] = useState(initialValues.universityId || selectedUniversityId || MOCK_UNIVERSITIES[0].id);
  const [collegeId, setCollegeId] = useState(initialValues.collegeId || '');
  const [departmentId, setDepartmentId] = useState(initialValues.departmentId || '');
  const [programmeName, setProgrammeName] = useState(initialValues.programmeName || 'B.Sc. Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState(initialValues.yearOfStudy || 'Year 3');

  const universities = MOCK_UNIVERSITIES;

  const filteredColleges = MOCK_COLLEGES.filter((c: College) => c.universityId === universityId);
  const filteredDepartments = MOCK_DEPARTMENTS.filter((d: Department) => d.collegeId === collegeId);
  const filteredProgrammes = MOCK_PROGRAMMES.filter((p: Programme) => p.departmentId === departmentId);

  useEffect(() => {
    if (selectedUniversityId) {
      setUniversityId(selectedUniversityId);
    }
  }, [selectedUniversityId]);

  const handleUniChange = (id: string) => {
    setUniversityId(id);
    setCollegeId('');
    setDepartmentId('');
    if (onUniversityChange) onUniversityChange(id);
  };

  const handleCollegeChange = (id: string) => {
    setCollegeId(id);
    setDepartmentId('');
    if (onCollegeChange) onCollegeChange(id);
  };

  const handleDeptChange = (id: string) => {
    setDepartmentId(id);
    if (onDepartmentChange) onDepartmentChange(id);
  };

  const handleProgChange = (val: string) => {
    setProgrammeName(val);
    if (onProgrammeChange) onProgrammeChange(val);
  };

  const handleYrChange = (val: string) => {
    setYearOfStudy(val);
    if (onYearChange) onYearChange(val);
  };

  return (
    <div className="space-y-4">
      {/* University Selection */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          University Institution <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <select
            value={universityId}
            onChange={(e) => handleUniChange(e.target.value)}
            className="w-full h-11 px-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-colors"
          >
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.shortName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* College Selection */}
      {filteredColleges.length > 0 && (
        <div className="space-y-1.5 animate-in fade-in duration-200">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            College / School (Optional)
          </label>
          <select
            value={collegeId}
            onChange={(e) => handleCollegeChange(e.target.value)}
            className="w-full h-10 px-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="">Select College / School...</option>
            {filteredColleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Department Selection */}
      {filteredDepartments.length > 0 && (
        <div className="space-y-1.5 animate-in fade-in duration-200">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Department (Optional)
          </label>
          <select
            value={departmentId}
            onChange={(e) => handleDeptChange(e.target.value)}
            className="w-full h-10 px-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="">Select Department...</option>
            {filteredDepartments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Degree Programme Name & Year of Study */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Degree Programme <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={programmeName}
            onChange={(e) => handleProgChange(e.target.value)}
            placeholder="e.g. B.Sc. Computer Science"
            className="w-full h-10 px-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Year of Study <span className="text-rose-500">*</span>
          </label>
          <select
            value={yearOfStudy}
            onChange={(e) => handleYrChange(e.target.value)}
            className="w-full h-10 px-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="Year 1">Year 1</option>
            <option value="Year 2">Year 2</option>
            <option value="Year 3">Year 3</option>
            <option value="Year 4">Year 4</option>
            <option value="Postgraduate / Masters">Postgraduate / Masters</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
