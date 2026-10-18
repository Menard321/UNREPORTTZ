<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportSection;
use App\Models\User;
use App\Services\TemplateResolutionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Initialize a new report based on university and report type template.
     */
    public function initialize(Request $request, TemplateResolutionService $resolutionService): JsonResponse
    {
        $validated = $request->validate([
            'university_id' => 'required|uuid',
            'report_type_id' => 'required|uuid',
            'title' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'academic_year' => 'nullable|string|max:50',
            'supervisor_name' => 'nullable|string|max:255',
            'metadata' => 'nullable|array',
        ]);

        $resolved = $resolutionService->resolve(
            $validated['university_id'],
            $validated['report_type_id']
        );

        if (!$resolved) {
            return response()->json([
                'success' => false,
                'message' => 'No published template found for the specified university and report type.',
            ], 422);
        }

        // Identify authenticated student or fallback demo user
        $userId = $request->user()?->id ?? User::first()?->id;

        $metadata = array_merge($validated['metadata'] ?? [], [
            'company_name' => $validated['company_name'] ?? null,
            'department' => $validated['department'] ?? null,
            'academic_year' => $validated['academic_year'] ?? null,
            'supervisor_name' => $validated['supervisor_name'] ?? null,
            'template_name' => $resolved['template_name'],
            'university_name' => $resolved['university']['name'],
            'formatting_rules' => $resolved['formatting_rules'],
        ]);

        $report = Report::create([
            'user_id' => $userId,
            'university_id' => $validated['university_id'],
            'report_type_id' => $validated['report_type_id'],
            'template_version_id' => $resolved['version']['id'],
            'title' => $validated['title'],
            'status' => 'draft',
            'current_step' => 1,
            'progress_percentage' => 0,
            'metadata' => $metadata,
        ]);

        // Automatically populate sections according to institutional template
        foreach ($resolved['sections'] as $sec) {
            ReportSection::create([
                'report_id' => $report->id,
                'template_section_id' => $sec['id'],
                'title' => $sec['title'],
                'content' => '',
                'order' => $sec['order'],
                'status' => 'pending',
                'word_count' => 0,
                'metadata' => [
                    'description' => $sec['description'],
                    'is_required' => $sec['is_required'],
                ],
            ]);
        }

        $report->load(['university', 'reportType', 'sections', 'templateVersion']);

        return response()->json([
            'success' => true,
            'message' => "Report initialized using {$resolved['university']['short_name']} template structure.",
            'data' => $report,
        ], 201);
    }

    /**
     * List user reports.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? User::first()?->id;

        $reports = Report::with(['university', 'reportType', 'sections'])
            ->where('user_id', $userId)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'count' => $reports->count(),
            'data' => $reports,
        ]);
    }

    /**
     * Get single report details.
     */
    public function show(string $id): JsonResponse
    {
        $report = Report::with([
            'university',
            'reportType',
            'sections' => function ($q) {
                $q->orderBy('order');
            },
            'templateVersion.formattingRules',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $report,
        ]);
    }

    /**
     * Update a report section's content or status.
     */
    public function updateSection(Request $request, string $reportId, string $sectionId): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'nullable|string',
            'status' => 'nullable|string|in:pending,drafting,completed',
            'metadata' => 'nullable|array',
        ]);

        $section = ReportSection::where('report_id', $reportId)->findOrFail($sectionId);

        if (isset($validated['content'])) {
            $section->content = $validated['content'];
            $section->word_count = str_word_count(strip_tags($validated['content']));
        }

        if (isset($validated['status'])) {
            $section->status = $validated['status'];
        }

        if (isset($validated['metadata'])) {
            $section->metadata = array_merge($section->metadata ?? [], $validated['metadata']);
        }

        $section->save();

        // Recalculate progress percentage
        $report = Report::with('sections')->findOrFail($reportId);
        $totalSections = $report->sections->count();
        $completedSections = $report->sections->where('status', 'completed')->count();
        $progress = $totalSections > 0 ? (int) round(($completedSections / $totalSections) * 100) : 0;

        $report->progress_percentage = $progress;
        if ($progress >= 100) {
            $report->status = 'completed';
        } elseif ($progress > 0 && $report->status === 'draft') {
            $report->status = 'drafting';
        }
        $report->save();

        return response()->json([
            'success' => true,
            'section' => $section,
            'report_progress' => $progress,
        ]);
    }
}
