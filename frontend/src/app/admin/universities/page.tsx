'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Building2, Plus, Search, CheckCircle2 } from 'lucide-react';
import { MOCK_UNIVERSITIES } from '@/lib/data/mock-data';

export default function AdminUniversitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-teal-400" /> University Management
          </h1>
          <p className="text-xs text-slate-400">Manage supported Tanzanian higher learning institutions.</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddOpen(true)} icon={<Plus className="w-4 h-4" />}>
          + Add New University
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_UNIVERSITIES.map((uni) => (
          <Card key={uni.id} className="p-5 bg-slate-950 border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-teal-400">{uni.shortName}</span>
              <Badge variant={uni.isVerified ? 'success' : 'secondary'}>{uni.isVerified ? 'Verified' : 'Draft'}</Badge>
            </div>
            <h3 className="text-lg font-bold text-white">{uni.name}</h3>
            <p className="text-xs text-slate-400">{uni.location}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
