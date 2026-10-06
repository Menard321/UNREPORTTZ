import { apiFetch } from './client';
import { ReportTemplate } from '@/types';
import { MOCK_TEMPLATES } from '../data/mock-data';

export const templateService = {
  async getTemplates(universityId?: string): Promise<ReportTemplate[]> {
    try {
      const query = universityId ? `?universityId=${universityId}` : '';
      return await apiFetch<ReportTemplate[]>(`/templates${query}`);
    } catch {
      let list = [...MOCK_TEMPLATES];
      if (universityId) {
        list = list.filter(t => t.universityId === universityId);
      }
      return list;
    }
  },

  async getTemplateById(id: string): Promise<ReportTemplate | undefined> {
    try {
      return await apiFetch<ReportTemplate>(`/templates/${id}`);
    } catch {
      return MOCK_TEMPLATES.find(t => t.id === id);
    }
  }
};
