'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  Save, 
  Eye, 
  Download, 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Wrench, 
  Layers, 
  SlidersHorizontal,
  Paperclip,
  Check,
  RefreshCw,
  Plus
} from 'lucide-react';
import { reportService } from '@/lib/api/reports';
import { aiService } from '@/lib/api/ai';
import { referenceService } from '@/lib/api/references';
import { useAuth } from '@/lib/context/auth-context';
import { AcademicReport, ReportSection, ReferenceItem } from '@/types';

export default function DocumentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const reportId = params.reportId as string;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const [report, setReport] = useState<AcademicReport | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [activeSection, setActiveSection] = useState<ReportSection | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Right Sidebar Tabs
  const [rightTab, setRightTab] = useState<'ai' | 'quality' | 'references' | 'evidence'>('ai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [references, setReferences] = useState<ReferenceItem[]>([]);

  useEffect(() => {
    async function loadData() {
      const rep = await reportService.getReportById(reportId);
      if (rep) {
        setReport(rep);
        if (rep.sections.length > 0) {
          setActiveSectionId(rep.sections[0].id);
          setActiveSection(rep.sections[0]);
          setEditorContent(rep.sections[0].content);
        }
      }
      const refs = await referenceService.getReferences(reportId);
      setReferences(refs);
    }
    loadData();
  }, [reportId]);

  const handleSelectSection = (sec: ReportSection) => {
    setActiveSectionId(sec.id);
    setActiveSection(sec);
    setEditorContent(sec.content);
  };

  const handleContentChange = (val: string) => {
    setEditorContent(val);
    setSaveStatus('unsaved');
  };

  const handleSaveSection = async () => {
    if (!report || !activeSectionId) return;
    setIsSaving(true);
    setSaveStatus('saving');

    await reportService.updateSection(reportId, activeSectionId, editorContent);

    setIsSaving(false);
    setSaveStatus('saved');
  };

  const handleAiTransform = async (action: any) => {
    setIsAiProcessing(true);
    try {
      const res = await aiService.executeAssistantAction({
        selectedText: editorContent,
        action: action as any,
        instruction: aiPrompt,
        universityName: report?.universityName,
      });
      setEditorContent(res.resultText);
      setSaveStatus('unsaved');
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Fixed Editor Top Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/reports">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>

          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white max-w-xs sm:max-w-md truncate">
              {report?.title || 'Loading Report Editor...'}
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>{report?.universityName}</span> •
              <span className="font-semibold text-blue-600">{report?.programmeName}</span> •
              <span className="capitalize">{saveStatus === 'saved' ? '✓ Saved to cloud' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="success" className="hidden sm:inline-flex">
            {report?.qualityScore || 94}% Quality Score
          </Badge>

          <Button size="sm" variant="outline" onClick={handleSaveSection} isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
            Save
          </Button>

          <Link href={`/preview/${reportId}`}>
            <Button size="sm" variant="secondary" icon={<Eye className="w-4 h-4" />}>
              Preview
            </Button>
          </Link>

          {report?.status === 'Paid' ? (
            <Link href={`/preview/${reportId}`}>
              <Button size="sm" variant="accent" icon={<Download className="w-4 h-4" />}>
                Export
              </Button>
            </Link>
          ) : (
            <Link href={`/dashboard/payments/${reportId}`}>
              <Button size="sm" variant="primary" icon={<Download className="w-4 h-4" />}>
                Pay & Export
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Column: Report Chapter Outline (Width 64) */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Document Outline</span>
            <span className="text-[10px] font-mono text-slate-400">{report?.sections.length || 0} Sections</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {report?.sections.map((sec, idx) => {
              const isActive = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleSelectSection(sec)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate pr-2">{sec.title}</span>
                  {sec.status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Column: Interactive Rich Text Editor Canvas */}
        <main className="flex-1 overflow-y-auto p-6 flex justify-center bg-slate-100 dark:bg-slate-950">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-8 space-y-6 min-h-[600px] flex flex-col">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                  Chapter Editor • {activeSection?.status || 'Draft'}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {activeSection?.title || 'Select a section to edit'}
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => handleAiTransform('technical')}>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-1" /> AI Polish
                </Button>
              </div>
            </div>

            {/* Rich Editor Area */}
            <div className="flex-1 flex flex-col space-y-2">
              <Textarea
                className="flex-1 min-h-[450px] font-sans text-sm leading-relaxed p-4 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={editorContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start typing your report section content..."
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Word Count: <strong>{editorContent.split(/\s+/).filter(Boolean).length}</strong> words</span>
              <span>Target Font: <strong>Times New Roman (12pt)</strong></span>
            </div>
          </div>
        </main>

        {/* Right Column: AI Assistant & Quality Inspector (Width 80) */}
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            {[
              { id: 'ai', label: 'AI', icon: Sparkles },
              { id: 'quality', label: 'Quality', icon: ShieldCheck },
              { id: 'references', label: 'Refs', icon: BookOpen },
              { id: 'evidence', label: 'Evidence', icon: Paperclip },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRightTab(tab.id as any)}
                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1 border-b-2 transition-colors cursor-pointer ${
                  rightTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/40'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* AI Assistant Tab */}
            {rightTab === 'ai' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">AI Writing Assistant</h4>
                  <p className="text-[11px] text-slate-500">Transform or expand section contents.</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleAiTransform('technical')} isLoading={isAiProcessing}>
                    Formal Academic
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAiTransform('expand')} isLoading={isAiProcessing}>
                    Expand Technical
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAiTransform('citations')} isLoading={isAiProcessing}>
                    Add IEEE Citations
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAiTransform('summary')} isLoading={isAiProcessing}>
                    Generate Summary
                  </Button>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="font-bold text-slate-800 dark:text-slate-200">Custom Prompt Instructions</label>
                  <Textarea
                    placeholder="e.g. Rewrite to highlight single-mode fiber OTDR attenuation results..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full"
                    isLoading={isAiProcessing}
                    onClick={() => handleAiTransform('custom')}
                    icon={<Sparkles className="w-3.5 h-3.5" />}
                  >
                    Run Custom AI Action
                  </Button>
                </div>
              </div>
            )}

            {/* Quality Inspector Tab */}
            {rightTab === 'quality' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400">Quality Score</span>
                  <p className="text-3xl font-black text-teal-800 dark:text-teal-300 font-mono">94%</p>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400">Format & structure ready for export</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">Compliance Checklist</h4>
                  {[
                    { label: 'UDSM Margins (1.5 in Left, 1.0 in Right)', pass: true },
                    { label: 'Times New Roman 12pt Line Spacing 1.5', pass: true },
                    { label: 'IEEE Citation Numeric Brackets', pass: true },
                    { label: 'Academic & Supervisor Declaration Signatures', pass: false },
                  ].map((chk, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                      {chk.pass ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span className={chk.pass ? 'text-slate-800 dark:text-slate-200' : 'text-amber-700 font-medium'}>
                        {chk.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* References Inspector Tab */}
            {rightTab === 'references' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white">Reference Index</h4>
                  <Badge variant="teal">{references.length} Citations</Badge>
                </div>

                <div className="space-y-2">
                  {references.map((ref) => (
                    <div key={ref.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-blue-600">[{ref.citationKey}]</span>
                        <Badge variant={ref.status === 'Verified' ? 'success' : 'warning'}>
                          {ref.status}
                        </Badge>
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{ref.authors} ({ref.year})</p>
                      <p className="text-[10px] text-slate-500 italic line-clamp-2">{ref.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Attachments Tab */}
            {rightTab === 'evidence' && (
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white">Evidence Attachments</h4>
                {report?.evidenceFiles && report.evidenceFiles.length > 0 ? (
                  <div className="space-y-2">
                    {report.evidenceFiles.map((ev) => (
                      <div key={ev.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{ev.fileName}</p>
                        <p className="text-[10px] text-slate-500">{ev.caption}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No evidence attachments added yet.</p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
