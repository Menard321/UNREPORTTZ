import { AcademicReport } from '@/types';
import { MOCK_REPORTS } from '@/lib/data/mock-data';

const STORAGE_KEY = 'unireporttz_user_reports';

export const getStoredReports = (): AcademicReport[] => {
  if (typeof window === 'undefined') return MOCK_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_REPORTS));
      return MOCK_REPORTS;
    }
    const reports: AcademicReport[] = JSON.parse(raw);
    // Ensure mock reports exist as fallback if list is empty
    return reports.length > 0 ? reports : MOCK_REPORTS;
  } catch (err) {
    console.error('Failed to load user reports from localStorage:', err);
    return MOCK_REPORTS;
  }
};

export const saveNewReport = (newReport: AcademicReport): AcademicReport => {
  if (typeof window === 'undefined') return newReport;
  try {
    const current = getStoredReports();
    const updated = [newReport, ...current.filter((r) => r.id !== newReport.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newReport;
  } catch (err) {
    console.error('Failed to save report to localStorage:', err);
    return newReport;
  }
};

export const getReportById = (id: string): AcademicReport | undefined => {
  const reports = getStoredReports();
  return reports.find((r) => r.id === id);
};
