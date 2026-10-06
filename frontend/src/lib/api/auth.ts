import { apiFetch } from './client';
import { User } from '@/types';

export interface LoginPayload {
  email: string;
  password?: string;
  remember?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  universityId?: string;
  agreeToTerms?: boolean;
}

export interface SetupProfilePayload {
  universityId: string;
  collegeId?: string;
  departmentId?: string;
  programmeName: string;
  yearOfStudy: string;
  regNumber?: string;
  graduationYear?: string;
}

export interface ResetPasswordPayload {
  email?: string;
  token?: string;
  password?: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ user: User; token: string }> {
    const res = await apiFetch<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (typeof window !== 'undefined' && res.token && res.user) {
      localStorage.setItem('unireport_auth_token', res.token);
      localStorage.setItem('unireport_user', JSON.stringify(res.user));
    }

    return res;
  },

  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    const res = await apiFetch<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (typeof window !== 'undefined' && res.token && res.user) {
      localStorage.setItem('unireport_auth_token', res.token);
      localStorage.setItem('unireport_user', JSON.stringify(res.user));
    }

    return res;
  },

  async verifyEmail(codeOrToken?: string): Promise<{ success: boolean; user: User }> {
    const res = await apiFetch<{ message: string; user: User }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token: codeOrToken }),
    });

    if (typeof window !== 'undefined' && res.user) {
      localStorage.setItem('unireport_user', JSON.stringify(res.user));
    }

    return { success: true, user: res.user };
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    return await apiFetch<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async setupProfile(payload: SetupProfilePayload): Promise<{ user: User }> {
    const res = await apiFetch<{ message: string; user: User }>('/profile/academic', {
      method: 'POST',
      body: JSON.stringify({
        university_id: payload.universityId,
        college_id: payload.collegeId,
        department_id: payload.departmentId,
        programme_name: payload.programmeName,
        year_of_study: payload.yearOfStudy,
        reg_number: payload.regNumber,
        graduation_year: payload.graduationYear,
      }),
    });

    if (typeof window !== 'undefined' && res.user) {
      localStorage.setItem('unireport_user', JSON.stringify(res.user));
    }

    return { user: res.user };
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiFetch<{ user: User }>('/auth/user');
    if (typeof window !== 'undefined' && res.user) {
      localStorage.setItem('unireport_user', JSON.stringify(res.user));
    }
    return res.user;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return await apiFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    return await apiFetch<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('unireport_auth_token');
      localStorage.removeItem('unireport_user');
    }
    // Asynchronous non-blocking backend session deletion
    apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
  },
};
