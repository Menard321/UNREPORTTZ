'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  const users = [
    { id: 'u1', name: 'Baraka Msangi', email: 'baraka@udsm.ac.tz', uni: 'UDSM', role: 'Student', reports: 3 },
    { id: 'u2', name: 'Neema Kilonzo', email: 'neema@udom.ac.tz', uni: 'UDOM', role: 'Student', reports: 2 },
    { id: 'u3', name: 'Juma Ramadhani', email: 'juma@sua.ac.tz', uni: 'SUA', role: 'Student', reports: 1 },
    { id: 'u4', name: 'System Admin', email: 'admin@unireporttz.co.tz', uni: 'UniReportTZ', role: 'Admin', reports: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-teal-400" /> Student User Accounts
        </h1>
        <p className="text-xs text-slate-400">Directory of registered students across Tanzanian universities.</p>
      </div>

      <Card className="overflow-hidden bg-slate-950 border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">University</th>
                <th className="p-4">Role</th>
                <th className="p-4">Reports</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/60">
                  <td className="p-4 font-bold text-white">{u.name}</td>
                  <td className="p-4 text-slate-400">{u.email}</td>
                  <td className="p-4 text-slate-300 font-semibold">{u.uni}</td>
                  <td className="p-4">
                    <Badge variant={u.role === 'Admin' ? 'teal' : 'primary'}>{u.role}</Badge>
                  </td>
                  <td className="p-4 font-mono text-teal-400">{u.reports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
