'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Search, MapPin, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { MOCK_UNIVERSITIES } from '@/lib/data/mock-data';
import { University } from '@/types';

export default function UniversitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  const filteredUnis = MOCK_UNIVERSITIES.filter((uni) =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary">Tanzanian Institutions</Badge>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Supported Tanzanian Universities
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Search and verify guidelines, colleges, and available report templates for your institution.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto pt-2">
          <Input
            placeholder="Search by university name (e.g. UDSM, UDOM, SUA, Mzumbe)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Grid of Universities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnis.map((uni) => (
          <Card key={uni.id} className="p-6 space-y-4 hover:shadow-xl hover:border-blue-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                  {uni.shortName}
                </span>
                <Badge variant={uni.isVerified ? 'success' : 'secondary'}>
                  {uni.isVerified ? 'Verified Template' : 'Standard Format'}
                </Badge>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{uni.name}</h3>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>{uni.location}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {uni.description}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Colleges & Schools: <strong>{uni.collegesCount}</strong></span>
                <span>Templates: <strong>{uni.reportTypes.length}</strong></span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedUni(uni)}>
                  View Details
                </Button>
                <Link href={`/dashboard/generate?uni=${uni.id}`} className="w-full">
                  <Button variant="primary" size="sm" className="w-full">
                    Select & Generate
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* University Detail Modal */}
      <Dialog
        isOpen={!!selectedUni}
        onClose={() => setSelectedUni(null)}
        title={selectedUni?.name}
        description={`Location: ${selectedUni?.location}`}
        maxWidth="lg"
      >
        {selectedUni && (
          <div className="space-y-6 pt-2">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedUni.description}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Available Report Guidelines for {selectedUni.shortName}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                {selectedUni.reportTypes.map((rt) => (
                  <div key={rt} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    <span className="capitalize">{rt.replace(/-/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setSelectedUni(null)}>
                Close
              </Button>
              <Link href={`/dashboard/generate?uni=${selectedUni.id}`}>
                <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                  Start Report for {selectedUni.shortName}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
