'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function StudentProfilePage() {
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(user?.name || 'Baraka John Msangi');
  const [phone, setPhone] = useState(user?.phone || '+255 754 123 456');
  const [programmeName, setProgrammeName] = useState(user?.programmeName || 'B.Sc. in Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState(user?.yearOfStudy || 'Year 3');
  const [regNumber, setRegNumber] = useState(user?.regNumber || '2023-04-08219');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, phone, programmeName, yearOfStudy, regNumber });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" /> Student Profile
        </h1>
        <p className="text-xs text-slate-500">
          Manage your personal details, academic institution profile, and registration number.
        </p>
      </div>

      <Card className="p-6 md:p-8 space-y-6">
        {saved && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile details saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              value={user?.email || 'baraka@udsm.ac.tz'}
              disabled
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">University Institution</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.universityName || 'University of Dar es Salaam'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Degree Programme"
              value={programmeName}
              onChange={(e) => setProgrammeName(e.target.value)}
            />
            <Input
              label="Year of Study"
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
            />
            <Input
              label="Registration Number"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
