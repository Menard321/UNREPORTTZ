<?php

namespace Tests\Feature;

use App\Models\ReportType;
use App\Models\University;
use App\Models\User;
use Tests\TestCase;

class TemplateResolutionTest extends TestCase
{
    public function test_can_list_universities(): void
    {
        $response = $this->getJson('/api/v1/universities');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'count',
            'data' => [
                '*' => ['id', 'name', 'short_name', 'location', 'status']
            ]
        ]);
    }

    public function test_can_resolve_template_dynamically(): void
    {
        $university = University::where('short_name', 'UDSM')->first();
        $reportType = ReportType::where('code', 'FIELDWORK')->first();

        $this->assertNotNull($university, 'UDSM university should exist');
        $this->assertNotNull($reportType, 'FIELDWORK report type should exist');

        $response = $this->getJson("/api/v1/templates/resolve?university_id={$university->id}&report_type_id={$reportType->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'data' => [
                'university' => [
                    'short_name' => 'UDSM',
                ],
                'report_type' => [
                    'code' => 'FIELDWORK',
                ],
            ]
        ]);

        $sections = $response->json('data.sections');
        $this->assertCount(7, $sections);
        $this->assertStringContainsString('CHAPTER 1', $sections[1]['title']);
    }

    public function test_can_initialize_report_from_template(): void
    {
        $user = User::first() ?? User::factory()->create([
            'name' => 'Test Student',
            'email' => 'student@test.unireport.tz',
            'password' => bcrypt('password123'),
        ]);

        $university = University::where('short_name', 'IFM')->first();
        $reportType = ReportType::where('code', 'FIELDWORK')->first();

        $response = $this->actingAs($user)->postJson('/api/v1/reports/initialize', [
            'university_id' => $university->id,
            'report_type_id' => $reportType->id,
            'title' => 'Field Practical Training Report at CRDB Bank',
            'company_name' => 'CRDB Bank Plc',
            'department' => 'Digital Banking & ICT Systems',
            'academic_year' => '2025/2026',
        ]);

        $response->assertStatus(201);
        $response->assertJson([
            'success' => true,
        ]);

        $reportData = $response->json('data');
        $this->assertEquals('Field Practical Training Report at CRDB Bank', $reportData['title']);
        $this->assertCount(7, $reportData['sections']);
        $this->assertEquals('IFM', $reportData['university']['short_name']);
    }
}
