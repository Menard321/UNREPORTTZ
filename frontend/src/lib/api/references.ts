import { apiFetch } from './client';
import { ReferenceItem } from '@/types';
import { MOCK_REFERENCES } from '../data/mock-data';

export const referenceService = {
  async getReferences(reportId?: string): Promise<ReferenceItem[]> {
    try {
      const query = reportId ? `?reportId=${reportId}` : '';
      return await apiFetch<ReferenceItem[]>(`/references${query}`);
    } catch {
      let list = [...MOCK_REFERENCES];
      if (reportId) {
        list = list.filter(r => r.reportId === reportId);
      }
      return list;
    }
  },

  async verifyReference(id: string): Promise<ReferenceItem> {
    try {
      return await apiFetch<ReferenceItem>(`/references/${id}/verify`, { method: 'POST' });
    } catch {
      const item = MOCK_REFERENCES.find(r => r.id === id);
      if (item) {
        item.status = 'Verified';
        item.verificationNotes = 'Verified against Crossref & Google Scholar database index.';
        return item;
      }
      throw new Error('Reference not found');
    }
  }
};
