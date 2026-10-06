'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, File, Trash2, CheckCircle2 } from 'lucide-react';
import { EvidenceFile } from '@/types';

export function FileUploader({
  onFilesChange,
  existingFiles = [],
}: {
  onFilesChange: (files: EvidenceFile[]) => void;
  existingFiles?: EvidenceFile[];
}) {
  const [files, setFiles] = useState<EvidenceFile[]>(existingFiles);
  const [isDragging, setIsDragging] = useState(false);

  const handleSimulatedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateAddFile('attached_evidence_doc.pdf', 2400000, 'application/pdf');
  };

  const simulateAddFile = (fileName: string, fileSize: number, fileType: string) => {
    const newFile: EvidenceFile = {
      id: `ev-${Date.now()}`,
      fileName,
      fileSize,
      fileType,
      fileUrl: '#',
      previewUrl: fileType.startsWith('image')
        ? 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400'
        : undefined,
      caption: `Uploaded attachment for evidence verification.`,
      uploadedAt: new Date().toISOString(),
    };
    const updated = [...files, newFile];
    setFiles(updated);
    onFilesChange(updated);
  };

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleSimulatedDrop}
        onClick={() => simulateAddFile('field_logbook_stamped.pdf', 3100000, 'application/pdf')}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-900/50'
        )}
      >
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Drag & drop evidence files or click to browse
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Supports JPG, PNG, PDF, DOCX logbooks & site photos (Up to 25MB each)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Uploaded Evidence ({files.length})
          </p>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            {files.map((file) => (
              <div key={file.id} className="p-3 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{file.fileName}</p>
                    <p className="text-xs text-slate-400">
                      {(file.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
