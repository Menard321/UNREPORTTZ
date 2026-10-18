<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ReportType;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    /**
     * List all registered universities with available template counts.
     */
    public function index(Request $request): JsonResponse
    {
        $universities = University::query()
            ->withCount(['templates' => function ($query) {
                $query->whereIn('status', ['published', 'verified']);
            }])
            ->where('status', 'active')
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'short_name', 'location', 'status']);

        return response()->json([
            'success' => true,
            'count' => $universities->count(),
            'data' => $universities,
        ]);
    }

    /**
     * Show single university details with its available templates.
     */
    public function show(string $id): JsonResponse
    {
        $university = University::with([
            'colleges',
            'templates' => function ($q) {
                $q->whereIn('status', ['published', 'verified'])->with('reportType', 'publishedVersion');
            },
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $university,
        ]);
    }

    /**
     * Get supported report types for a given university.
     */
    public function reportTypes(string $id): JsonResponse
    {
        $university = University::findOrFail($id);

        // Fetch all report types with their template availability status for this university
        $allReportTypes = ReportType::all();
        $universityTemplates = $university->templates()
            ->whereIn('status', ['published', 'verified'])
            ->get()
            ->keyBy('report_type_id');

        $payload = $allReportTypes->map(function ($rt) use ($universityTemplates) {
            $hasTemplate = $universityTemplates->has($rt->id);
            $template = $hasTemplate ? $universityTemplates->get($rt->id) : null;

            return [
                'id' => $rt->id,
                'name' => $rt->name,
                'code' => $rt->code,
                'description' => $rt->description,
                'has_verified_template' => $hasTemplate,
                'template_id' => $template?->id,
            ];
        });

        return response()->json([
            'success' => true,
            'university' => [
                'id' => $university->id,
                'name' => $university->name,
                'short_name' => $university->short_name,
            ],
            'data' => $payload,
        ]);
    }

    /**
     * List verified, published templates for university (+ optional report_type_id filter).
     */
    public function templates(Request $request, string $id): JsonResponse
    {
        $university = University::findOrFail($id);
        $query = $university->templates()
            ->whereIn('status', ['published', 'verified'])
            ->with(['reportType', 'publishedVersion.sections', 'publishedVersion.formattingRules']);

        if ($request->has('report_type_id')) {
            $query->where('report_type_id', $request->query('report_type_id'));
        }

        $templates = $query->get();

        return response()->json([
            'success' => true,
            'university' => [
                'id' => $university->id,
                'name' => $university->name,
                'short_name' => $university->short_name,
            ],
            'count' => $templates->count(),
            'data' => $templates,
        ]);
    }
}
