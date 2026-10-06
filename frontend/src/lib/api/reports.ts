import { apiFetch } from './client';
import { AcademicReport, ReportStatus, WritingPreferences, EvidenceFile } from '@/types';
import { MOCK_REPORTS } from '../data/mock-data';

export interface CreateReportPayload {
  title: string;
  reportTypeSlug: string;
  universityId: string;
  programmeName: string;
  regNumber: string;
  yearOfStudy: string;
  semester?: string;
  academicYear?: string;
  academicSupervisor?: string;
  fieldSupervisor?: string;
  writingPreferences?: Partial<WritingPreferences>;
  evidenceFiles?: EvidenceFile[];
}

export const reportService = {
  async getReports(status?: ReportStatus): Promise<AcademicReport[]> {
    try {
      const query = status ? `?status=${status}` : '';
      return await apiFetch<AcademicReport[]>(`/reports${query}`);
    } catch {
      let reports = [...MOCK_REPORTS];
      if (status) {
        reports = reports.filter(r => r.status.toLowerCase() === status.toLowerCase());
      }
      return reports;
    }
  },

  async getReportById(id: string): Promise<AcademicReport | undefined> {
    try {
      return await apiFetch<AcademicReport>(`/reports/${id}`);
    } catch {
      return MOCK_REPORTS.find(r => r.id === id);
    }
  },

  async createReport(payload: CreateReportPayload): Promise<AcademicReport> {
    try {
      return await apiFetch<AcademicReport>('/reports', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      const newReport: AcademicReport = {
        id: `rep-gen-${Date.now()}`,
        title: payload.title || 'Untitled Academic Report',
        studentId: 'usr-101',
        studentName: 'Baraka John Msangi',
        regNumber: payload.regNumber || '2023-04-08219',
        universityId: payload.universityId || 'uni-udsm',
        universityName: 'University of Dar es Salaam',
        programmeName: payload.programmeName || 'B.Sc. in Computer Science',
        yearOfStudy: payload.yearOfStudy || 'Year 3',
        semester: payload.semester || 'Semester 2',
        academicYear: payload.academicYear || '2025/2026',
        academicSupervisor: payload.academicSupervisor || 'Dr. J. Shirima',
        fieldSupervisor: payload.fieldSupervisor || 'Eng. G. Mwakyusa',
        reportTypeSlug: (payload.reportTypeSlug as any) || 'field-training',
        reportTypeName: 'Field Practical Training Report',
        status: 'Ready',
        completionPercentage: 100,
        missingFields: [],
        qualityScore: 92,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        writingPreferences: {
          academicTone: payload.writingPreferences?.academicTone || 'rigorous',
          languageVariant: payload.writingPreferences?.languageVariant || 'en-TZ',
          reportLength: payload.writingPreferences?.reportLength || 'standard',
          citationStyle: payload.writingPreferences?.citationStyle || 'IEEE',
          perspective: payload.writingPreferences?.perspective || 'third-person',
        },
        evidenceFiles: payload.evidenceFiles || [],
        sections: [
          {
            id: 'sec-new-1',
            title: 'Executive Summary',
            order: 1,
            wordCount: 320,
            status: 'completed',
            content: 'This academic report outlines the practical tasks, technical methodologies, and field attachments completed according to university requirements.'
          },
          {
            id: 'sec-new-2',
            title: 'Chapter 1: Background & Objectives',
            order: 2,
            wordCount: 750,
            status: 'completed',
            content: '### 1.1 Introduction\nThe primary objective of this attachment is to bridge academic coursework with real-world industry practice.'
          },
          {
            id: 'sec-new-3',
            title: 'Chapter 2: Technical Execution & Activities',
            order: 3,
            wordCount: 1200,
            status: 'completed',
            content: '### 2.1 Applied Engineering & Software Workflow\nSummary of technical operations, equipment utilized, and project milestones accomplished.'
          }
        ]
      };
      MOCK_REPORTS.unshift(newReport);
      return newReport;
    }
  },

  async updateReport(id: string, updates: Partial<AcademicReport>): Promise<AcademicReport> {
    try {
      return await apiFetch<AcademicReport>(`/reports/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch {
      const idx = MOCK_REPORTS.findIndex(r => r.id === id);
      if (idx !== -1) {
        MOCK_REPORTS[idx] = { ...MOCK_REPORTS[idx], ...updates, updatedAt: new Date().toISOString() };
        return MOCK_REPORTS[idx];
      }
      throw new Error('Report not found');
    }
  },

  async updateSection(reportId: string, sectionId: string, content: string): Promise<AcademicReport> {
    try {
      return await apiFetch<AcademicReport>(`/reports/${reportId}/sections/${sectionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      });
    } catch {
      const report = MOCK_REPORTS.find(r => r.id === reportId);
      if (report) {
        const sec = report.sections.find(s => s.id === sectionId);
        if (sec) {
          sec.content = content;
          sec.wordCount = content.split(/\s+/).filter(Boolean).length;
          sec.status = 'reviewed';
        }
        report.updatedAt = new Date().toISOString();
        return report;
      }
      throw new Error('Report or section not found');
    }
  }
};
