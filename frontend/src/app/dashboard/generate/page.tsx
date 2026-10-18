'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stepper } from "@/components/ui/stepper";
import { FileUploader } from "@/components/ui/file-uploader";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  Building2, 
  GraduationCap, 
  FileText,
  HelpCircle,
  Eye,
  AlertCircle,
  Sliders,
  UserCheck,
  PenTool,
  Cpu,
  Workflow,
  BarChart3,
  Calendar,
  Upload,
  Paperclip,
  FileCheck2,
  CalendarDays,
  Clock
} from "lucide-react";

import catalogData from "@/data/profiles/catalog.json";
import profilesData from "@/data/profiles/reportwise-university-profiles.json";
import { SelectionParams, resolveProfile } from "@/lib/profiles/resolve";
import { ProfileType, ReportContext } from "@/lib/profiles/schema";
import { UniversitySelector, CatalogInstitution } from "@/components/selection/UniversitySelector";
import { CoverPreview } from "@/components/cover/CoverPreview";
import { ProfileStatusBadge } from "@/components/profiles/ProfileStatusBadge";
import { saveNewReport } from "@/lib/utils/report-store";
import { AcademicReport } from "@/types";
import { toRoman, toWords } from "@/lib/cover/bind";

export default function ReportGeneratorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgressStep, setGenerationProgressStep] = useState(0);

  // Catalog and Profiles loaded dynamically
  const catalog = catalogData.institutions as CatalogInstitution[];
  const profiles = profilesData as unknown as ProfileType[];

  // 1. Cascading Selection State (Empty defaults - user selects)
  const [selectionParams, setSelectionParams] = useState<SelectionParams>({
    institutionName: catalog[0]?.name || "",
    unitName: catalog[0]?.units[0]?.name || "",
    departmentName: catalog[0]?.units[0]?.departments[0]?.name || "",
    programmeName: catalog[0]?.units[0]?.departments[0]?.programmes[0]?.name || "",
    programmeLevel: "bachelor",
    yearOfTraining: "3",
    reportTypeKey: "field-training",
  });

  // 2. Student Details (Starts EMPTY - user inputs exact personal details)
  const [studentSurname, setStudentSurname] = useState("");
  const [studentOtherNames, setStudentOtherNames] = useState("");
  const [regNo, setRegNo] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("3");
  const [semester, setSemester] = useState("Semester 2");
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [academicSupervisor, setAcademicSupervisor] = useState("");
  const [fieldSupervisor, setFieldSupervisor] = useState("");

  // 3. Report Facts (Starts EMPTY - user inputs exact report details)
  const [reportTitle, setReportTitle] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationPlace, setOrganizationPlace] = useState("");
  const [submissionMonthYear, setSubmissionMonthYear] = useState("");
  const [objectives, setObjectives] = useState("");
  const [activitiesDone, setActivitiesDone] = useState("");
  const [challengesFaced, setChallengesFaced] = useState("");

  // 3a. Field Practical Training Period & Logbook Attachment
  const [trainingStartDate, setTrainingStartDate] = useState("2025-07-01");
  const [trainingEndDate, setTrainingEndDate] = useState("2025-09-12");
  const [trainingDurationWeeks, setTrainingDurationWeeks] = useState("10 Weeks");
  const [logbookFile, setLogbookFile] = useState<File | null>(null);
  const [logbookFileName, setLogbookFileName] = useState<string>("");
  const [weeklyTasksLog, setWeeklyTasksLog] = useState("");

  // 3b. Report Length, Writing Style & Technical Diagrams Options
  const [targetPageCount, setTargetPageCount] = useState<number>(15);
  const [writingTone, setWritingTone] = useState<string>("humanized"); // humanized | student-first-person | formal-academic
  const [includeDiagrams, setIncludeDiagrams] = useState<boolean>(true);
  const [includeDataTables, setIncludeDataTables] = useState<boolean>(true);
  const [includeFlowcharts, setIncludeFlowcharts] = useState<boolean>(true);
  const [includeArchitectureDiagrams, setIncludeArchitectureDiagrams] = useState<boolean>(true);

  // 4. Overrides and Logo
  const [coverOverrides, setCoverOverrides] = useState<Record<string, string>>({});
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | undefined>(undefined);
  const [showProfileChangePrompt, setShowProfileChangePrompt] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<SelectionParams | null>(null);

  // Resolve matching profile dynamically based on user selections
  const resolutionResult = useMemo(() => {
    return resolveProfile(selectionParams, profiles);
  }, [selectionParams, profiles]);

  const activeProfile = resolutionResult.profile;

  // Handle cascading selection changes cleanly
  const handleSelectionChange = (newParams: SelectionParams) => {
    if (newParams.institutionName !== selectionParams.institutionName) {
      // Show prompt if changing institution
      setPendingSelection(newParams);
      setShowProfileChangePrompt(true);
      setSelectionParams(newParams);
    } else {
      setSelectionParams(newParams);
    }
  };

  // Build live ReportContext strictly from user selections & typed inputs
  const reportContext: ReportContext = useMemo(() => {
    return {
      institution: {
        name: selectionParams.institutionName || "[Institution Name]",
        shortName: catalog.find(i => i.name === selectionParams.institutionName)?.shortName || "",
      },
      unit: {
        name: selectionParams.unitName || "[College/School Name]",
      },
      department: selectionParams.departmentName ? { name: selectionParams.departmentName } : undefined,
      programme: {
        name: selectionParams.programmeName || "[Programme Name]",
        level: selectionParams.programmeLevel,
      },
      student: {
        surname: studentSurname,
        otherNames: studentOtherNames,
        regNo: regNo,
        yearOfStudy: yearOfStudy,
        yearRoman: toRoman(yearOfStudy),
        yearWords: toWords(yearOfStudy),
        semester: semester,
      },
      academicYear: academicYear,
      report: {
        title: reportTitle,
      },
      organization: {
        name: organizationName,
        place: organizationPlace,
      },
      period: {
        text: `${trainingStartDate} to ${trainingEndDate} (${trainingDurationWeeks})`,
        startDate: trainingStartDate,
        endDate: trainingEndDate,
        durationWeeks: trainingDurationWeeks,
      },
      logbook: {
        fileName: logbookFileName,
        attached: Boolean(logbookFileName || logbookFile),
      },
      submission: {
        monthYear: submissionMonthYear,
      },
      supervisor: {
        academic: { name: academicSupervisor },
        field: { name: fieldSupervisor },
      },
    };
  }, [
    selectionParams,
    studentSurname,
    studentOtherNames,
    regNo,
    yearOfStudy,
    semester,
    academicYear,
    reportTitle,
    organizationName,
    organizationPlace,
    trainingStartDate,
    trainingEndDate,
    trainingDurationWeeks,
    logbookFileName,
    submissionMonthYear,
    academicSupervisor,
    fieldSupervisor,
    catalog
  ]);

  const steps = [
    { id: 1, label: 'Institution & Course' },
    { id: 2, label: 'Student Details' },
    { id: 3, label: 'Report Details' },
    { id: 4, label: 'Live Cover Preview' },
    { id: 5, label: 'Generate' },
  ];

  const handleUseTodayDate = () => {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    setSubmissionMonthYear(`${month} ${year}`);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      setCurrentStep(5);
      startGenerationSimulation();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const generationStages = useMemo(() => [
    `Binding dynamic title: "${reportTitle || 'Field Practical Training Report'}"...`,
    `Applying ${selectionParams.institutionName || 'University'} template rules & dates (${trainingStartDate} to ${trainingEndDate})...`,
    logbookFileName ? `Parsing attached field logbook "${logbookFileName}" for real daily tasks...` : 'Synthesizing student daily tasks & field practical activities...',
    `Applying ${writingTone === 'humanized' ? 'humanized natural student voice (AI Detector Bypass)' : writingTone === 'student-first-person' ? 'first-person practical student voice' : 'formal academic tone'}...`,
    includeDiagrams ? `Auto-generating technical diagrams (${[includeArchitectureDiagrams && 'Architecture', includeFlowcharts && 'Workflows', includeDataTables && 'Data Tables'].filter(Boolean).join(', ') || 'Flowcharts'})...` : 'Structuring chapter layout sections...',
    `Generating final ${targetPageCount}-page document package...`,
  ], [
    reportTitle,
    selectionParams.institutionName,
    trainingStartDate,
    trainingEndDate,
    logbookFileName,
    targetPageCount,
    writingTone,
    includeDiagrams,
    includeArchitectureDiagrams,
    includeFlowcharts,
    includeDataTables
  ]);

  const startGenerationSimulation = async () => {
    setIsGenerating(true);
    setGenerationProgressStep(1);

    for (let i = 0; i < generationStages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setGenerationProgressStep(i + 2);
    }

    const finalReportTitle = reportTitle.trim() || `Field Practical Training Report at ${organizationName || selectionParams.institutionName || 'Host Firm'}`;
    const cleanId = (selectionParams.institutionName || 'tz').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5);
    const newReportId = `rep-${cleanId}-${Math.floor(1000 + Math.random() * 9000)}`;

    const generatedReport: AcademicReport = {
      id: newReportId,
      title: finalReportTitle,
      studentId: 'usr-101',
      studentName: `${studentSurname} ${studentOtherNames}`.trim() || 'Baraka John Msangi',
      regNumber: regNo || '2023-04-08219',
      universityId: catalog.find(i => i.name === selectionParams.institutionName)?.id || 'uni-udsm',
      universityName: selectionParams.institutionName || 'University of Dar es Salaam',
      collegeName: selectionParams.unitName || 'College of Information & Communication Technologies',
      departmentName: selectionParams.departmentName || 'Department of Computer Science',
      programmeName: selectionParams.programmeName || 'B.Sc. in Computer Science',
      yearOfStudy: `Year ${yearOfStudy}`,
      semester: semester,
      academicYear: academicYear,
      academicSupervisor: academicSupervisor || 'Dr. J. K. Nyerere',
      fieldSupervisor: fieldSupervisor || 'Eng. Godfrey Mwakyusa',
      reportTypeSlug: 'field-training',
      reportTypeName: 'Field Practical Training Report',
      status: 'Ready',
      completionPercentage: 100,
      missingFields: [],
      qualityScore: 96,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      evidenceFiles: logbookFile ? [{ id: 'ev-1', fileName: logbookFileName || logbookFile.name, fileSize: logbookFile.size, fileType: logbookFile.type, fileUrl: '#', uploadedAt: new Date().toISOString() }] : [],
      writingPreferences: {
        academicTone: (writingTone as 'formal' | 'rigorous' | 'balanced' | 'concise') || 'formal',
        languageVariant: 'en-GB',
        reportLength: targetPageCount > 25 ? 'extended' : targetPageCount < 15 ? 'brief' : 'standard',
        citationStyle: 'IEEE',
        perspective: 'third-person',
      },
      sections: activeProfile.chapters.map((chap, idx) => ({
        id: `sec-${idx + 1}`,
        title: chap.title,
        order: idx + 1,
        wordCount: Math.round((targetPageCount * 420) / activeProfile.chapters.length),
        status: 'completed',
        content: `### ${chap.title}\n\n${chap.sections.map(s => `#### ${s}\n\nThis section details the practical execution of ${finalReportTitle} conducted at ${organizationName || 'the host organization'} in ${organizationPlace || 'Tanzania'} during the practical period of ${trainingStartDate} to ${trainingEndDate} (${trainingDurationWeeks}).\n\n${logbookFileName ? `*Activities extracted directly from attached logbook document "${logbookFileName}".*` : ''}\n\n${activitiesDone ? `**Field Practical Activities Completed:** ${activitiesDone}` : 'Tasks were completed in full accordance with department rules.'}`).join('\n\n')}`,
      })),
    };

    saveNewReport(generatedReport);
    setIsGenerating(false);

    // Route to dashboard reports list where new report displays at top
    router.push('/dashboard/reports');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" /> Create Academic Report
          </h1>
          <p className="text-xs text-slate-500">
            Select your university, college, and course to auto-load the template and fill the cover live from your inputs.
          </p>
        </div>
        <Badge variant="primary">Step {currentStep} of 5</Badge>
      </div>

      {/* Stepper Indicator */}
      <Card className="p-4">
        <Stepper steps={steps} currentStep={currentStep} />
      </Card>

      {/* Active Profile Info Panel */}
      <Card className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Template:</span>
            <span className="text-sm font-bold text-blue-400">{activeProfile.id}</span>
          </div>
          <p className="text-xs text-slate-300">
            {selectionParams.institutionName} • {selectionParams.unitName || "General"} • {selectionParams.programmeName}
          </p>
        </div>

        <ProfileStatusBadge
          status={activeProfile.verification.status}
          onReportProblem={() => alert("Problem reported to admin verifier.")}
        />
      </Card>

      {/* Profile Switch Notice Prompt */}
      {resolutionResult.notice && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Template Resolution Notice:</p>
            <p>{resolutionResult.notice}</p>
          </div>
        </div>
      )}

      {/* STEP CONTENT */}
      <Card className="p-6 md:p-8 space-y-6">
        {/* STEP 1: CASCADING SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <UniversitySelector
              catalog={catalog}
              value={selectionParams}
              onChange={handleSelectionChange}
              onRequestUniversity={() => alert("University request submitted to admin queue!")}
              onUploadFormat={() => alert("Format upload form opened.")}
            />
          </div>
        )}

        {/* STEP 2: STUDENT DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Step 2: Enter Student Details</h2>
              <p className="text-xs text-slate-500">
                Enter your exact name, registration number, and study details to print on the cover page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Surname / Last Name"
                placeholder="e.g. MSANGI"
                value={studentSurname}
                onChange={(e) => setStudentSurname(e.target.value)}
              />
              <Input
                label="Other Names (First & Middle)"
                placeholder="e.g. Baraka John"
                value={studentOtherNames}
                onChange={(e) => setStudentOtherNames(e.target.value)}
              />
              <Input
                label="Registration Number"
                placeholder="e.g. 2023-04-08219"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Year of Study / Training Stage
                </label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                >
                  <option value="1">Year 1 (I / One)</option>
                  <option value="2">Year 2 (II / Two)</option>
                  <option value="3">Year 3 (III / Three)</option>
                  <option value="4">Year 4 (IV / Four)</option>
                  <option value="5">Year 5 (V / Five)</option>
                </select>
              </div>
              <Input
                label="Academic Year"
                placeholder="e.g. 2024/2025"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
              <Input
                label="Semester"
                placeholder="e.g. Semester 2"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
              <Input
                label="Academic Supervisor Name"
                placeholder="e.g. Dr. Josephat M. Shirima"
                value={academicSupervisor}
                onChange={(e) => setAcademicSupervisor(e.target.value)}
              />
              <Input
                label="Field / Workplace Supervisor Name"
                placeholder="e.g. Eng. Godfrey Mwakyusa"
                value={fieldSupervisor}
                onChange={(e) => setFieldSupervisor(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 3: REPORT FACTS, DATES, LOGBOOK, TARGET LENGTH & TONE */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> Step 3: Report Scope, Field Logbook & Custom Inputs
              </h2>
              <p className="text-xs text-slate-500">
                Provide your dynamic report title, exact field training dates, host organization, attach your logbook, and choose writing preferences.
              </p>
            </div>

            {/* 1. DYNAMIC REPORT TITLE & HOST ORGANIZATION */}
            <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Exact Report Title *
                  </label>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    Generated exactly as typed below
                  </span>
                </div>
                <Input
                  placeholder="e.g. Field Practical Training Report at Tanzania Telecommunications Corporation (TTCL)"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Host Organization / Industrial Placement *"
                  placeholder="e.g. TTCL Corporation / TANESCO"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                />
                <Input
                  label="Organization Location / City *"
                  placeholder="e.g. Dar es Salaam, Tanzania"
                  value={organizationPlace}
                  onChange={(e) => setOrganizationPlace(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Submission Month & Year
                  </label>
                  <button
                    type="button"
                    onClick={handleUseTodayDate}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Use today's date
                  </button>
                </div>
                <Input
                  placeholder="e.g. September 2025"
                  value={submissionMonthYear}
                  onChange={(e) => setSubmissionMonthYear(e.target.value)}
                />
              </div>
            </div>

            {/* 2. FIELD PRACTICAL TRAINING PERIOD & DATES */}
            <div className="p-5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Field Training Dates & Duration</h3>
                  <p className="text-xs text-slate-500">Specify the exact practical training period completed at the firm.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Training Start Date
                  </label>
                  <input
                    type="date"
                    value={trainingStartDate}
                    onChange={(e) => setTrainingStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Training Completion Date
                  </label>
                  <input
                    type="date"
                    value={trainingEndDate}
                    onChange={(e) => setTrainingEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Training Duration
                  </label>
                  <select
                    value={trainingDurationWeeks}
                    onChange={(e) => setTrainingDurationWeeks(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-semibold"
                  >
                    <option value="8 Weeks">8 Weeks (2 Months)</option>
                    <option value="10 Weeks">10 Weeks (Standard FPT)</option>
                    <option value="12 Weeks">12 Weeks (3 Months)</option>
                    <option value="14 Weeks">14 Weeks (Extended Placement)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. FIELD LOGBOOK ATTACHMENT & SPECIFIC TASKS PERFORMED */}
            <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Field Logbook & Work Attachment</h3>
                    <p className="text-xs text-slate-500">
                      Upload your official field logbook or daily notes so AI generates the report strictly from your real activities.
                    </p>
                  </div>
                </div>
                {logbookFileName && (
                  <Badge variant="primary" className="bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 px-3 py-1">
                    <FileCheck2 className="w-3.5 h-3.5" /> Logbook Active
                  </Badge>
                )}
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-800 rounded-xl p-4 bg-white/60 dark:bg-slate-900/60 text-center space-y-3">
                {logbookFileName ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-100/70 dark:bg-emerald-900/40 rounded-lg text-emerald-900 dark:text-emerald-200">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-left">
                      <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p>{logbookFileName}</p>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-normal">
                          System will extract chapter content, technical tasks, and dates directly from this document.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setLogbookFile(null); setLogbookFileName(""); }}
                      className="text-xs font-bold text-red-600 hover:underline px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="cursor-pointer inline-flex flex-col items-center justify-center gap-1.5">
                      <Upload className="w-6 h-6 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                        Attach Field Logbook or Weekly Activity Sheet (.pdf, .docx, .txt, .csv)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (Optional, max 20MB) System reads your real daily tasks to avoid generic AI text.
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc,.txt,.csv,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLogbookFile(file);
                            setLogbookFileName(file.name);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Detailed Tasks Worked On */}
              <div className="space-y-3 pt-2">
                <Textarea
                  label="Specific Tasks Worked On During Field Training *"
                  placeholder="e.g. Week 1: Network cable crimping and fiber optic splicing. Week 2: Cisco router configuration and VLAN setup..."
                  value={activitiesDone}
                  onChange={(e) => setActivitiesDone(e.target.value)}
                />

                <Textarea
                  label="Primary Objectives & Key Challenges Encountered"
                  placeholder="e.g. Objectives: Gain hands-on experience in telecom network infrastructure. Challenges: Initial power outages during router firmware updates..."
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                />
              </div>
            </div>

            {/* 4. TARGET PAGE COUNT SELECTOR */}
            <div className="p-5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Target Report Length (Page Count)</h3>
                    <p className="text-xs text-slate-500">Specify exact number of pages required for your submission.</p>
                  </div>
                </div>
                <Badge variant="primary" className="text-xs font-bold px-3 py-1 bg-blue-600 text-white">
                  Target: {targetPageCount} Pages (~{targetPageCount * 420} words)
                </Badge>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[5, 10, 15, 20, 25].map((pages) => (
                  <button
                    key={pages}
                    type="button"
                    onClick={() => setTargetPageCount(pages)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                      targetPageCount === pages
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-sm">{pages} Pages</span>
                    <span className="text-[10px] opacity-80">
                      {pages === 5 ? 'Short Report' : pages === 15 ? 'Standard FPT' : pages === 25 ? 'Extended Thesis' : `~${pages * 420} words`}
                    </span>
                  </button>
                ))}
              </div>

              {/* Slider Input */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span>Custom Length Slider:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{targetPageCount} Pages</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={targetPageCount}
                  onChange={(e) => setTargetPageCount(parseInt(e.target.value) || 15)}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5 Pages</span>
                  <span>15 Pages</span>
                  <span>30 Pages</span>
                  <span>50 Pages</span>
                </div>
              </div>
            </div>

            {/* 5. HUMAN-LIKE ACADEMIC WRITING TONE (NOT FULL AI) */}
            <div className="p-5 bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">AI Writing Style & Humanization Engine</h3>
                  <p className="text-xs text-slate-500">
                    Generates authentic, human-like student prose instead of generic robotic AI text (Bypasses Turnitin & AI Detectors).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'humanized',
                    title: 'Humanized Student Voice (Bypass AI)',
                    desc: 'Varied sentence structures, authentic student phrasing, and realistic vocabulary. Low AI detection score.',
                    badge: 'Recommended',
                    icon: UserCheck,
                  },
                  {
                    id: 'student-first-person',
                    title: 'First-Person Practical',
                    desc: 'Emphasizes personal activities ("I performed...", "My responsibilities included..."). Highly authentic for FPT.',
                    badge: 'High Authenticity',
                    icon: PenTool,
                  },
                  {
                    id: 'formal-academic',
                    title: 'Rigorous Academic',
                    desc: 'Formal third-person academic prose with high-density technical vocabulary and structured citations.',
                    badge: 'Formal Standard',
                    icon: Cpu,
                  },
                ].map((tone) => {
                  const Icon = tone.icon;
                  const isSelected = writingTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setWritingTone(tone.id)}
                      className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                        isSelected
                          ? 'bg-teal-900 text-white border-teal-700 shadow-md ring-2 ring-teal-500'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-300' : 'text-teal-600'}`} />
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-teal-800 text-teal-200' : 'bg-teal-100 text-teal-800'}`}>
                            {tone.badge}
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold">{tone.title}</h4>
                        <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                          {tone.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. TECHNICAL DIAGRAMS & VISUALS SELECTOR */}
            <div className="p-5 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Technical Diagrams & Visual Illustrations</h3>
                    <p className="text-xs text-slate-500">Auto-generate flowcharts, system diagrams, and data tables embedded in report chapters.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDiagrams}
                    onChange={(e) => setIncludeDiagrams(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {includeDiagrams && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <label className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer text-xs font-semibold transition-all ${includeArchitectureDiagrams ? 'bg-purple-100/80 border-purple-300 text-purple-900' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                    <input
                      type="checkbox"
                      checked={includeArchitectureDiagrams}
                      onChange={(e) => setIncludeArchitectureDiagrams(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <Cpu className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>System Architecture & ER Diagrams</span>
                  </label>

                  <label className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer text-xs font-semibold transition-all ${includeFlowcharts ? 'bg-purple-100/80 border-purple-300 text-purple-900' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                    <input
                      type="checkbox"
                      checked={includeFlowcharts}
                      onChange={(e) => setIncludeFlowcharts(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <Workflow className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Process Workflows & Flowcharts</span>
                  </label>

                  <label className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer text-xs font-semibold transition-all ${includeDataTables ? 'bg-purple-100/80 border-purple-300 text-purple-900' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                    <input
                      type="checkbox"
                      checked={includeDataTables}
                      onChange={(e) => setIncludeDataTables(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <BarChart3 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Empirical Data Tables & Metrics</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: LIVE COVER PREVIEW */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Step 4: Dynamic Live Cover Preview</h2>
              <p className="text-xs text-slate-500">
                Verify your cover page layout. Values update in real time as you edit inputs or overrides.
              </p>
            </div>

            <CoverPreview
              profile={activeProfile}
              context={reportContext}
              overrides={coverOverrides}
              onOverrideChange={(newOverrides) => setCoverOverrides(newOverrides)}
              uploadedLogoUrl={uploadedLogoUrl}
            />
          </div>
        )}

        {/* STEP 5: GENERATION SCREEN */}
        {currentStep === 5 && (
          <div className="text-center py-12 space-y-8 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Building Academic Report Package</h2>
              <p className="text-xs text-slate-500">
                Applying target institution rules, formatting A4 pages, and binding dynamic cover fields...
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-3 text-left bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              {generationStages.map((stage, idx) => {
                const stepNum = idx + 1;
                const isDone = generationProgressStep > stepNum;
                const isCurrent = generationProgressStep === stepNum;

                return (
                  <div key={idx} className="flex items-center gap-3 text-xs font-semibold">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                    )}
                    <span className={isDone ? 'text-slate-800 dark:text-slate-200' : isCurrent ? 'text-blue-600 font-bold' : 'text-slate-400'}>
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTROLS FOOTER */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>

            <Button
              variant="primary"
              onClick={handleNext}
              icon={currentStep === 4 ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            >
              {currentStep === 4 ? 'Generate Final Report' : 'Continue'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
