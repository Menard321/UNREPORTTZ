import { apiFetch } from './client';
import { University, ReportTypeConfig } from '@/types';
import { MOCK_UNIVERSITIES, MOCK_REPORT_TYPES } from '../data/mock-data';

export const universityService = {
  async getUniversities(search?: string): Promise<University[]> {
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      return await apiFetch<University[]>(`/universities${query}`);
    } catch {
      let list = [...MOCK_UNIVERSITIES];
      if (search) {
        const queryLower = search.toLowerCase();
        list = list.filter(u => 
          u.name.toLowerCase().includes(queryLower) || 
          u.shortName.toLowerCase().includes(queryLower) ||
          u.location.toLowerCase().includes(queryLower)
        );
      }
      return list;
    }
  },

  async getUniversityById(id: string): Promise<University | undefined> {
    try {
      return await apiFetch<University>(`/universities/${id}`);
    } catch {
      return MOCK_UNIVERSITIES.find(u => u.id === id || u.shortName.toLowerCase() === id.toLowerCase());
    }
  },

  async getReportTypes(): Promise<ReportTypeConfig[]> {
    try {
      return await apiFetch<ReportTypeConfig[]>('/report-types');
    } catch {
      return MOCK_REPORT_TYPES;
    }
  }
};
