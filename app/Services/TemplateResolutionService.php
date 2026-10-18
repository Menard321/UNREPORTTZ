<?php

namespace App\Services;

use App\Models\Template;
use App\Models\TemplateVersion;
use App\Models\University;
use App\Models\ReportType;

class TemplateResolutionService
{
    /**
     * Resolve the active, published template for a university and report type.
     */
    public function resolve(string $universityId, string $reportTypeId): ?array
    {
        $template = Template::with(['university', 'reportType'])
            ->where('university_id', $universityId)
            ->where('report_type_id', $reportTypeId)
            ->where('status', 'published')
            ->first();

        // If not found by status='published', look for verified
        if (!$template) {
            $template = Template::with(['university', 'reportType'])
                ->where('university_id', $universityId)
                ->where('report_type_id', $reportTypeId)
                ->whereIn('status', ['published', 'verified'])
                ->first();
        }

        // If still no institution-specific template found, look for General / National fallback
        if (!$template) {
            $generalUniversity = University::where('short_name', 'OUT')
                ->orWhere('name', 'like', '%National Standard%')
                ->first();

            if ($generalUniversity) {
                $template = Template::with(['university', 'reportType'])
                    ->where('university_id', $generalUniversity->id)
                    ->where('report_type_id', $reportTypeId)
                    ->first();
            }
        }

        if (!$template) {
            return null;
        }

        $version = $template->versions()
            ->where('status', 'published')
            ->latest('created_at')
            ->with(['sections', 'formattingRules'])
            ->first()
            ?? $template->versions()
            ->latest('created_at')
            ->with(['sections', 'formattingRules'])
            ->first();

        if (!$version) {
            return null;
        }

        return $this->formatTemplatePayload($template, $version);
    }

    /**
     * Preview template structure by template ID.
     */
    public function preview(string $templateId): ?array
    {
        $template = Template::with([
            'university',
            'reportType',
            'publishedVersion.sections',
            'publishedVersion.formattingRules',
        ])->find($templateId);

        if (!$template) {
            return null;
        }

        $version = $template->publishedVersion ?? $template->latestVersion;
        if (!$version) {
            return null;
        }

        return $this->formatTemplatePayload($template, $version);
    }

    /**
     * Format uniform template payload.
     */
    protected function formatTemplatePayload(Template $template, TemplateVersion $version): array
    {
        return [
            'template_id' => $template->id,
            'template_name' => $template->name,
            'code' => $template->code,
            'description' => $template->description,
            'status' => $template->status,
            'university' => [
                'id' => $template->university->id,
                'name' => $template->university->name,
                'short_name' => $template->university->short_name,
                'location' => $template->university->location,
            ],
            'report_type' => [
                'id' => $template->reportType->id,
                'name' => $template->reportType->name,
                'code' => $template->reportType->code,
            ],
            'version' => [
                'id' => $version->id,
                'version_number' => $version->version_number,
                'format' => $version->file_format,
                'file_size' => $version->file_size,
                'checksum' => $version->checksum,
                'verified_at' => $version->verified_at?->toISOString(),
                'published_at' => $version->published_at?->toISOString(),
            ],
            'sections' => $version->sections->map(function ($sec) {
                return [
                    'id' => $sec->id,
                    'title' => $sec->title,
                    'description' => $sec->description,
                    'order' => $sec->order,
                    'is_required' => (bool) $sec->is_required,
                ];
            })->values()->all(),
            'formatting_rules' => $version->formattingRules->mapWithKeys(function ($rule) {
                return [$rule->rule_type => $rule->configuration];
            })->all(),
        ];
    }
}
