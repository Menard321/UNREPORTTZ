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
  AlertCircle
} from "lucide-react";

import catalogData from "../../../../data/profiles/catalog.json";
import profilesData from "../../../../data/profiles/reportwise-university-profiles.json";
import { SelectionParams, resolveProfile } from "@/lib/profiles/resolve";
import { ProfileType, ReportContext } from "@/lib/profiles/schema";
import { UniversitySelector, CatalogInstitution } from "@/components/selection/UniversitySelector";
import { CoverPreview } from "@/components/cover/CoverPreview";
import { ProfileStatusBadge } from "@/components/profiles/ProfileStatusBadge";
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

  const startGenerationSimulation = async () => {
    setIsGenerating(true);
    setGenerationProgressStep(1);

    const stages = [
      'Applying selected university template formatting...',
      'Structuring chapter sections according to profile rules...',
      'Synthesizing report sections from user typed responses...',
      'Validating token placeholders against report context...',
      'Running automated cover template linter check...',
      'Generating final A4 formatted document package...',
    ];

    for (let i = 0; i < stages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setGenerationProgressStep(i + 2);
    }

    setIsGenerating(false);
    // Route to dashboard reports
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

        {/* STEP 3: REPORT FACTS */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Step 3: Enter Report & Submission Details</h2>
              <p className="text-xs text-slate-500">Provide report title, organization, and submission date.</p>
            </div>

            <div className="space-y-4">
              <Textarea
                label="Report Title"
                placeholder="e.g. Field Practical Training Report at Tanzania Telecommunications Corporation (TTCL)"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Host Organization / Firm Name"
                  placeholder="e.g. TTCL Corporation"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                />
                <Input
                  label="Organization Location / City"
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

              <Textarea
                label="Primary Objectives Summary"
                placeholder="State your main training objectives..."
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
              />

              <Textarea
                label="Technical Tasks & Activities Accomplished"
                placeholder="Summary of main tasks performed..."
                value={activitiesDone}
                onChange={(e) => setActivitiesDone(e.target.value)}
              />
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
              {[
                'Applying selected university template formatting',
                'Structuring chapter sections according to profile rules',
                'Synthesizing report sections from user typed responses',
                'Validating token placeholders against report context',
                'Running automated cover template linter check',
                'Generating final A4 formatted document package',
              ].map((stage, idx) => {
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
