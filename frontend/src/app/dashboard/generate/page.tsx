'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stepper } from '@/components/ui/stepper';
import { FileUploader } from '@/components/ui/file-uploader';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Briefcase, 
  FileText, 
  GraduationCap, 
  Wrench, 
  Award, 
  BookOpen, 
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { MOCK_UNIVERSITIES, MOCK_REPORT_TYPES } from '@/lib/data/mock-data';
import { reportService } from '@/lib/api/reports';
import { EvidenceFile, ReportTypeSlug } from '@/types';

export default function ReportGeneratorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgressStep, setGenerationProgressStep] = useState(0);

  // Form State
  const [selectedReportType, setSelectedReportType] = useState<ReportTypeSlug>('field-training');
  const [selectedUniId, setSelectedUniId] = useState('uni-udsm');
  const [programmeName, setProgrammeName] = useState('B.Sc. in Computer Science');
  const [regNumber, setRegNumber] = useState('2023-04-08219');
  const [yearOfStudy, setYearOfStudy] = useState('Year 3');
  const [semester, setSemester] = useState('Semester 2');
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [academicSupervisor, setAcademicSupervisor] = useState('Dr. Josephat M. Shirima');
  const [fieldSupervisor, setFieldSupervisor] = useState('Eng. Godfrey Mwakyusa');

  // Report Details
  const [reportTitle, setReportTitle] = useState('Field Practical Training Report at Tanzania Telecommunications Corporation (TTCL)');
  const [organizationName, setOrganizationName] = useState('TTCL Corporation (Dar es Salaam Head Office)');
  const [duration, setDuration] = useState('8 Weeks (July 2025 – September 2025)');
  const [objectives, setObjectives] = useState('Gain practical exposure to single-mode fiber optic splicing, Cisco switch VLAN configuration, OTDR line testing, and software-defined network monitoring.');
  const [activitiesDone, setActivitiesDone] = useState('Participated in OTDR cable signal loss measurements, configured IEEE 802.1Q VLANs across 3 branch offices, and conducted weekly server room maintenance.');
  const [challengesFaced, setChallengesFaced] = useState('Legacy PDH multiplexer compatibility issues and intermittent power outages prior to UPS installation.');

  // Evidence Files
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);

  // Writing Preferences
  const [academicTone, setAcademicTone] = useState<'formal' | 'rigorous' | 'balanced'>('rigorous');
  const [citationStyle, setCitationStyle] = useState<'IEEE' | 'APA7' | 'Harvard'>('IEEE');
  const [perspective, setPerspective] = useState<'third-person' | 'first-person'>('third-person');

  const steps = [
    { id: 1, label: 'Report Type' },
    { id: 2, label: 'University' },
    { id: 3, label: 'Academic Info' },
    { id: 4, label: 'Report Details' },
    { id: 5, label: 'Evidence' },
    { id: 6, label: 'Preferences' },
    { id: 7, label: 'Review' },
    { id: 8, label: 'Generate' },
  ];

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 7) {
      setCurrentStep(8);
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
      'Analyzing university & department requirements...',
      'Structuring report chapter outline...',
      'Generating academic body sections...',
      'Processing uploaded evidence attachments & figure captions...',
      'Verifying reference citations against index...',
      'Applying university page margins & font formatting rules...',
      'Running automated academic quality audit...',
    ];

    for (let i = 0; i < stages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setGenerationProgressStep(i + 2);
    }

    // Save report to service
    const created = await reportService.createReport({
      title: reportTitle,
      reportTypeSlug: selectedReportType,
      universityId: selectedUniId,
      programmeName,
      regNumber,
      yearOfStudy,
      semester,
      academicYear,
      academicSupervisor,
      fieldSupervisor,
      writingPreferences: {
        academicTone,
        citationStyle,
        perspective,
      },
      evidenceFiles,
    });

    setIsGenerating(false);
    router.push(`/editor/${created.id}`);
  };

  const selectedUniObj = MOCK_UNIVERSITIES.find((u) => u.id === selectedUniId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" /> AI Academic Report Generator
          </h1>
          <p className="text-xs text-slate-500">
            Follow the 8-step wizard to configure and generate your university-formatted report.
          </p>
        </div>
        <Badge variant="primary" className="hidden sm:inline-flex">Step {currentStep} of 8</Badge>
      </div>

      {/* Stepper Progress Indicator */}
      <Card className="p-4">
        <Stepper steps={steps} currentStep={currentStep} />
      </Card>

      {/* Step Content */}
      <Card className="p-6 md:p-8 space-y-6">
        {/* STEP 1: REPORT TYPE */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Step 1: Choose Your Report Type</h2>
              <p className="text-xs text-slate-500">Select the specific academic report required by your faculty.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_REPORT_TYPES.map((rt) => {
                const isSelected = selectedReportType === rt.slug;
                return (
                  <div
                    key={rt.id}
                    onClick={() => setSelectedReportType(rt.slug)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{rt.name}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{rt.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: UNIVERSITY */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Step 2: Select Your University</h2>
              <p className="text-xs text-slate-500">UniReportTZ will apply formatting rules for your institution.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Target University
                </label>
                <select
                  value={selectedUniId}
                  onChange={(e) => setSelectedUniId(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 font-semibold"
                >
                  {MOCK_UNIVERSITIES.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.shortName}) — {u.location}</option>
                  ))}
                </select>
              </div>

              {selectedUniObj && (
                <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-between text-xs text-teal-900 dark:text-teal-200">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="font-bold">{selectedUniObj.shortName} Template Guidelines Verified</p>
                      <p className="text-[11px] text-teal-700 dark:text-teal-400">Includes margins, Times/Arial font rules, and chapter divider structure.</p>
                    </div>
                  </div>
                  <Badge variant="teal">Template Verified</Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: ACADEMIC INFORMATION */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Step 3: Academic & Supervision Details</h2>
              <p className="text-xs text-slate-500">Enter student details and supervisor roles for cover page generation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Registration Number"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
              />
              <Input
                label="Degree Programme"
                value={programmeName}
                onChange={(e) => setProgrammeName(e.target.value)}
              />
              <Input
                label="Year of Study"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
              />
              <Input
                label="Semester & Academic Year"
                value={`${semester} (${academicYear})`}
                onChange={(e) => setSemester(e.target.value)}
              />
              <Input
                label="Academic Supervisor"
                value={academicSupervisor}
                onChange={(e) => setAcademicSupervisor(e.target.value)}
              />
              <Input
                label="Field / Industry Supervisor"
                value={fieldSupervisor}
                onChange={(e) => setFieldSupervisor(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 4: REPORT DETAILS */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Step 4: Report Details & Attachment Experience</h2>
              <p className="text-xs text-slate-500">Provide specific facts regarding host organization and practical tasks.</p>
            </div>

            <div className="space-y-4">
              <Input
                label="Report Title"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Host Organization / Site"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                />
                <Input
                  label="Attachment Duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <Textarea
                label="Primary Objectives"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
              />

              <Textarea
                label="Technical Activities Accomplished"
                value={activitiesDone}
                onChange={(e) => setActivitiesDone(e.target.value)}
              />

              <Textarea
                label="Challenges & Solutions"
                value={challengesFaced}
                onChange={(e) => setChallengesFaced(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 5: EVIDENCE UPLOAD */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Step 5: Upload Field Evidence & Logbooks</h2>
              <p className="text-xs text-slate-500">Attach photos, logbook scans, or site diagrams to insert into report figures.</p>
            </div>

            <FileUploader
              onFilesChange={(files) => setEvidenceFiles(files)}
              existingFiles={evidenceFiles}
            />
          </div>
        )}

        {/* STEP 6: WRITING PREFERENCES */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Step 6: Writing Style & Citation Preferences</h2>
              <p className="text-xs text-slate-500">Configure academic tone and reference formatting style.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Academic Tone
                </label>
                <select
                  value={academicTone}
                  onChange={(e) => setAcademicTone(e.target.value as any)}
                  className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                >
                  <option value="rigorous">Formal Academic (Rigorous)</option>
                  <option value="formal">Balanced Academic</option>
                  <option value="concise">Concise Technical</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Citation Style
                </label>
                <select
                  value={citationStyle}
                  onChange={(e) => setCitationStyle(e.target.value as any)}
                  className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                >
                  <option value="IEEE">IEEE Style (Numeric [1])</option>
                  <option value="APA7">APA 7th Edition (Author, Year)</option>
                  <option value="Harvard">Harvard Reference Style</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Writing Perspective
                </label>
                <select
                  value={perspective}
                  onChange={(e) => setPerspective(e.target.value as any)}
                  className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                >
                  <option value="third-person">Third-Person ("The student...")</option>
                  <option value="first-person">First-Person ("I performed...")</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW STEP */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Step 7: Review Report Configuration</h2>
              <p className="text-xs text-slate-500">Confirm all information before starting AI report generation.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-slate-500">Report Title:</span>
                <span className="font-bold text-slate-900 dark:text-white max-w-xs text-right">{reportTitle}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-slate-500">University:</span>
                <span>{selectedUniObj?.name} ({selectedUniObj?.shortName})</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-slate-500">Programme & Reg:</span>
                <span>{programmeName} ({regNumber})</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-slate-500">Host Organization:</span>
                <span>{organizationName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-slate-500">Supervisors:</span>
                <span>{academicSupervisor} / {fieldSupervisor}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Evidence Files:</span>
                <span>{evidenceFiles.length} Uploaded Attachment(s)</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: GENERATION PROGRESS SCREEN */}
        {currentStep === 8 && (
          <div className="text-center py-12 space-y-8 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Preparing Your Academic Report</h2>
              <p className="text-xs text-slate-500">
                Applying university formatting, writing chapter contents, and verifying reference index...
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-3 text-left bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              {[
                'Analyzing university requirements',
                'Preparing report chapter structure',
                'Generating academic sections & executive summary',
                'Processing evidence attachments',
                'Verifying reference citations',
                'Applying formatting rules & page margins',
                'Running quality check',
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

        {/* Wizard Controls Footer */}
        {currentStep < 8 && (
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
              icon={currentStep === 7 ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            >
              {currentStep === 7 ? 'Generate Report' : 'Continue'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
