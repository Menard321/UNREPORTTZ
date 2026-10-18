<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Services\TemplateDiscoveryService;
use App\Services\TemplateResolutionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    /**
     * List all templates with optional filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Template::with(['university', 'reportType', 'publishedVersion'])
            ->whereIn('status', ['published', 'verified']);

        if ($request->has('university_id')) {
            $query->where('university_id', $request->query('university_id'));
        }

        if ($request->has('report_type_id')) {
            $query->where('report_type_id', $request->query('report_type_id'));
        }

        $templates = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'count' => $templates->count(),
            'data' => $templates,
        ]);
    }

    /**
     * Dynamically resolve template structure for university + report type combination.
     */
    public function resolve(Request $request, TemplateResolutionService $resolutionService): JsonResponse
    {
        $validated = $request->validate([
            'university_id' => 'required|uuid',
            'report_type_id' => 'required|uuid',
        ]);

        $resolved = $resolutionService->resolve(
            $validated['university_id'],
            $validated['report_type_id']
        );

        if (!$resolved) {
            return response()->json([
                'success' => false,
                'message' => 'No published or verified template found for the specified university and report type.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $resolved,
        ]);
    }

    /**
     * Preview template details and section blueprint by template ID.
     */
    public function preview(string $id, TemplateResolutionService $resolutionService): JsonResponse
    {
        $preview = $resolutionService->preview($id);

        if (!$preview) {
            return response()->json([
                'success' => false,
                'message' => 'Template not found or has no verified versions.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $preview,
        ]);
    }

    /**
     * Trigger filesystem template discovery and database sync.
     */
    public function sync(Request $request, TemplateDiscoveryService $discoveryService): JsonResponse
    {
        $dryRun = $request->boolean('dry_run', false);
        $result = $discoveryService->sync($dryRun);

        return response()->json([
            'success' => true,
            'dry_run' => $dryRun,
            'summary' => $result,
        ]);
    }
}
