import { apiFetch } from './client';
import { PaymentTransaction, PaymentMethod } from '@/types';
import { MOCK_PAYMENTS, MOCK_REPORTS } from '../data/mock-data';

export interface InitiatePaymentPayload {
  reportId: string;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  amountTzs: number;
}

export const paymentService = {
  async getPayments(): Promise<PaymentTransaction[]> {
    try {
      return await apiFetch<PaymentTransaction[]>('/payments');
    } catch {
      return MOCK_PAYMENTS;
    }
  },

  async initiatePayment(payload: InitiatePaymentPayload): Promise<PaymentTransaction> {
    try {
      return await apiFetch<PaymentTransaction>('/payments/initiate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      const report = MOCK_REPORTS.find(r => r.id === payload.reportId);
      const newTx: PaymentTransaction = {
        id: `pay-${Date.now()}`,
        transactionId: `${payload.paymentMethod.replace('-', '')}-TZ-${Math.floor(1000000 + Math.random() * 9000000)}`,
        reportId: payload.reportId,
        reportTitle: report?.title || 'Academic Report Export',
        studentId: 'usr-101',
        studentName: 'Baraka John Msangi',
        amountTzs: payload.amountTzs || 15000,
        amountUsd: Number(((payload.amountTzs || 15000) / 2600).toFixed(2)),
        paymentMethod: payload.paymentMethod,
        phoneNumber: payload.phoneNumber || '+255 754 123 456',
        status: 'Successful',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };
      MOCK_PAYMENTS.unshift(newTx);

      // Unlock report status to Paid
      if (report) {
        report.status = 'Paid';
      }

      return newTx;
    }
  },

  async checkPaymentStatus(transactionId: string): Promise<PaymentTransaction> {
    try {
      return await apiFetch<PaymentTransaction>(`/payments/status/${transactionId}`);
    } catch {
      const tx = MOCK_PAYMENTS.find(p => p.transactionId === transactionId || p.id === transactionId);
      if (tx) return tx;
      throw new Error('Transaction not found');
    }
  }
};
