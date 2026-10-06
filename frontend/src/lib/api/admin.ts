import { apiFetch } from './client';
import { AdminAnalytics } from '@/types';
import { MOCK_ADMIN_ANALYTICS, MOCK_UNIVERSITIES, MOCK_REPORTS } from '../data/mock-data';

export const adminService = {
  async getAnalytics(): Promise<AdminAnalytics> {
    try {
      return await apiFetch<AdminAnalytics>('/admin/analytics');
    } catch {
      return MOCK_ADMIN_ANALYTICS;
    }
  },

  async updateUniversityStatus(id: string, status: 'active' | 'archived'): Promise<void> {
    try {
      await apiFetch(`/admin/universities/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {
      const u = MOCK_UNIVERSITIES.find(item => item.id === id);
      if (u) u.status = status;
    }
  }
};
