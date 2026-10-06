'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Download, Upload, CheckCircle2, ShieldAlert, Edit, Trash2 } from "lucide-react";

export default function AdminCatalogPage() {
  const [activeTab, setActiveTab] = useState<"institutions" | "import">("institutions");
  const [jsonInput, setJsonInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Initial catalog mock/data state for manager UI
  const [catalogItems, setCatalogItems] = useState([
    {
      id: "inst-udsm",
      name: "University of Dar es Salaam",
      shortName: "UDSM",
      type: "university",
      unitsCount: 11,
      programmesCount: 42,
      active: true,
    },
    {
      id: "inst-cbe",
      name: "College of Business Education",
      shortName: "CBE",
      type: "college",
      unitsCount: 4,
      programmesCount: 18,
      active: true,
    },
    {
      id: "inst-ifm",
      name: "Institute of Finance Management",
      shortName: "IFM",
      type: "institute",
      unitsCount: 5,
      programmesCount: 22,
      active: true,
    },
    {
      id: "inst-nit",
      name: "National Institute of Transport",
      shortName: "NIT",
      type: "institute",
      unitsCount: 3,
      programmesCount: 14,
      active: true,
    },
    {
      id: "inst-aru",
      name: "Ardhi University",
      shortName: "ARU",
      type: "university",
      unitsCount: 6,
      programmesCount: 28,
      active: true,
    }
  ]);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(catalogItems, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "reportwise-catalog.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed) || parsed.institutions) {
        setStatusMessage("✅ Catalog JSON successfully validated and imported!");
      } else {
        setStatusMessage("❌ Invalid Catalog JSON structure. Expected array or object with 'institutions'.");
      }
    } catch (e) {
      setStatusMessage("❌ JSON Parse Error: Please verify syntax.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> Academic Catalog Manager
          </h1>
          <p className="text-xs text-slate-500">
            Manage institutions, colleges, schools, departments, and programmes without code deployment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportJson} icon={<Download className="w-4 h-4" />}>
            Export Catalog JSON
          </Button>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Add Institution
          </Button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("institutions")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === "institutions"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Institutions Directory ({catalogItems.length})
        </button>
        <button
          onClick={() => setActiveTab("import")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === "import"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          JSON Import / Bulk Sync
        </button>
      </div>

      {/* DIRECTORY TAB */}
      {activeTab === "institutions" && (
        <Card className="p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Institution Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Colleges / Schools</th>
                  <th className="py-3 px-4">Programmes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {catalogItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {item.name} <span className="text-slate-400 font-normal">({item.shortName})</span>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-600 dark:text-slate-300">{item.type}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{item.unitsCount} Units</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{item.programmesCount} Courses</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="teal" className="text-[10px]">Active</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Button variant="ghost" size="sm" icon={<Edit className="w-3.5 h-3.5" />}>
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* IMPORT TAB */}
      {activeTab === "import" && (
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Import / Upsert Catalog JSON</h3>
            <p className="text-xs text-slate-500">
              Paste catalog JSON containing institutions, units, departments, and programmes to update database in bulk.
            </p>
          </div>

          <textarea
            rows={10}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste JSON array e.g. { "institutions": [...] }'
            className="w-full p-4 font-mono text-xs bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {statusMessage && (
            <div className="p-3 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              {statusMessage}
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="primary" onClick={handleImportJson} icon={<Upload className="w-4 h-4" />}>
              Validate & Import Catalog
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
