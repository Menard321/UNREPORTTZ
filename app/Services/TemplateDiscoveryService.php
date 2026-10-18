<?php

namespace App\Services;

use App\Models\FormattingRule;
use App\Models\ReportType;
use App\Models\Template;
use App\Models\TemplateSection;
use App\Models\TemplateVersion;
use App\Models\University;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use ZipArchive;

class TemplateDiscoveryService
{
    protected string $templatesPath;

    public function __construct(?string $templatesPath = null)
    {
        $this->templatesPath = $templatesPath ?? config('unireport.templates_path', base_path('templates'));
    }

    /**
     * Scan the authoritative templates directory and return metadata of discovered files.
     */
    public function discover(): array
    {
        if (!File::isDirectory($this->templatesPath)) {
            Log::warning("Templates directory not found at: {$this->templatesPath}");
            return [];
        }

        $allFiles = File::allFiles($this->templatesPath);
        $discovered = [];

        foreach ($allFiles as $file) {
            $filename = $file->getFilename();
            if (str_starts_with($filename, '~$') || str_starts_with($filename, '.')) {
                continue;
            }

            $extension = strtolower($file->getExtension());
            if (!in_array($extension, ['docx', 'pdf'])) {
                continue;
            }

            $relativePath = str_replace('\\', '/', $file->getRelativePathname());
            $fullPath = str_replace('\\', '/', $file->getRealPath());
            $filename = $file->getFilename();
            $fileSize = $file->getSize();
            $checksum = hash_file('sha256', $fullPath);

            $institution = $this->resolveInstitutionInfo($filename);
            $reportTypeInfo = $this->resolveReportTypeInfo($filename);
            $extractedStructure = $this->extractStructure($fullPath, $extension, $filename, $institution);

            $discovered[] = [
                'filename' => $filename,
                'relative_path' => $relativePath,
                'full_path' => $fullPath,
                'format' => $extension,
                'file_size' => $fileSize,
                'checksum' => $checksum,
                'university' => $institution,
                'report_type' => $reportTypeInfo,
                'structure' => $extractedStructure,
            ];
        }

        return $discovered;
    }

    /**
     * Synchronize discovered templates with database idempotently.
     */
    public function sync(bool $dryRun = false): array
    {
        $discovered = $this->discover();
        $results = [
            'scanned_count' => count($discovered),
            'universities_synced' => 0,
            'report_types_synced' => 0,
            'templates_synced' => 0,
            'versions_synced' => 0,
            'sections_synced' => 0,
            'items' => [],
        ];

        foreach ($discovered as $item) {
            $uInfo = $item['university'];
            $rtInfo = $item['report_type'];

            $status = 'discovered';

            if (!$dryRun) {
                // 1. Ensure University exists
                $university = University::firstOrCreate(
                    ['short_name' => $uInfo['short_name']],
                    [
                        'name' => $uInfo['name'],
                        'status' => 'active',
                        'location' => $uInfo['location'] ?? 'Tanzania',
                    ]
                );
                // In case university already existed by name or short_name was null
                if ($university->wasRecentlyCreated) {
                    $results['universities_synced']++;
                }

                // 2. Ensure ReportType exists
                $reportType = ReportType::firstOrCreate(
                    ['code' => $rtInfo['code']],
                    [
                        'name' => $rtInfo['name'],
                        'description' => $rtInfo['description'] ?? "Standard {$rtInfo['name']} requirements for Tanzanian higher learning institutions.",
                    ]
                );
                if ($reportType->wasRecentlyCreated) {
                    $results['report_types_synced']++;
                }

                // 3. Find or Create Template
                $templateName = "{$university->short_name} {$reportType->name} Official Template";
                $template = Template::firstOrCreate(
                    [
                        'university_id' => $university->id,
                        'report_type_id' => $reportType->id,
                    ],
                    [
                        'name' => $templateName,
                        'code' => "{$university->short_name}_{$reportType->code}_TMPL",
                        'description' => "Authoritative academic report template conforming to {$university->name} guidelines.",
                        'status' => 'published',
                    ]
                );
                if ($template->wasRecentlyCreated) {
                    $results['templates_synced']++;
                }

                // 4. Find or Create TemplateVersion by checksum
                $version = TemplateVersion::firstOrNew([
                    'template_id' => $template->id,
                    'checksum' => $item['checksum'],
                ]);

                $isNewVersion = !$version->exists;
                $version->version_number = $version->version_number ?? '1.0.0';
                $version->effective_date = Carbon::now()->startOfYear();
                $version->file_path = $item['relative_path'];
                $version->file_format = $item['format'];
                $version->file_size = $item['file_size'];
                $version->metadata = [
                    'source_filename' => $item['filename'],
                    'relative_path' => $item['relative_path'],
                    'checksum' => $item['checksum'],
                    'detected_institution' => $uInfo['name'],
                    'chapter_count' => count($item['structure']['sections'] ?? []),
                    'formatting' => $item['structure']['formatting'] ?? [],
                    'raw_headings' => $item['structure']['raw_headings'] ?? [],
                ];
                $version->status = 'published';
                $version->verified_at = Carbon::now();
                $version->published_at = Carbon::now();
                $version->save();

                if ($isNewVersion) {
                    $results['versions_synced']++;
                }

                // 5. Synchronize Template Sections
                $sections = $item['structure']['sections'] ?? [];
                // Remove outdated template sections for this version to ensure exact ordering
                $version->sections()->delete();

                foreach ($sections as $index => $sec) {
                    TemplateSection::create([
                        'template_version_id' => $version->id,
                        'title' => $sec['title'],
                        'description' => $sec['description'] ?? null,
                        'order' => $index + 1,
                        'is_required' => $sec['is_required'] ?? true,
                    ]);
                    $results['sections_synced']++;
                }

                // 6. Synchronize Formatting Rules
                $formatting = $item['structure']['formatting'] ?? [];
                $version->formattingRules()->delete();

                foreach ($formatting as $type => $ruleConfig) {
                    FormattingRule::create([
                        'template_version_id' => $version->id,
                        'rule_type' => $type,
                        'configuration' => $ruleConfig,
                    ]);
                }

                $status = $isNewVersion ? 'created' : 'updated';
            }

            $results['items'][] = [
                'filename' => $item['filename'],
                'university' => $uInfo['short_name'],
                'report_type' => $rtInfo['code'],
                'format' => $item['format'],
                'checksum' => substr($item['checksum'], 0, 12) . '...',
                'sections_count' => count($item['structure']['sections'] ?? []),
                'sync_status' => $status,
            ];
        }

        return $results;
    }

    /**
     * Map filename to University metadata.
     */
    protected function resolveInstitutionInfo(string $filename): array
    {
        $upper = strtoupper($filename);

        if (str_contains($upper, 'UDSM')) {
            return [
                'short_name' => 'UDSM',
                'name' => 'University of Dar es Salaam',
                'location' => 'Dar es Salaam, Tanzania',
            ];
        }

        if (str_contains($upper, 'IFM')) {
            return [
                'short_name' => 'IFM',
                'name' => 'Institute of Finance Management',
                'location' => 'Dar es Salaam, Tanzania',
            ];
        }

        if (str_contains($upper, 'CBE')) {
            return [
                'short_name' => 'CBE',
                'name' => 'College of Business Education',
                'location' => 'Dar es Salaam / Dodoma, Tanzania',
            ];
        }

        if (str_contains($upper, 'ARTHI') || str_contains($upper, 'ARDHI') || str_contains($upper, 'ARU')) {
            return [
                'short_name' => 'ARU',
                'name' => 'Ardhi University',
                'location' => 'Dar es Salaam, Tanzania',
            ];
        }

        if (str_contains($upper, 'NIT')) {
            return [
                'short_name' => 'NIT',
                'name' => 'National Institute of Transport',
                'location' => 'Dar es Salaam, Tanzania',
            ];
        }

        return [
            'short_name' => 'OUT',
            'name' => 'Open University of Tanzania / National Standard',
            'location' => 'Tanzania',
        ];
    }

    /**
     * Map filename to ReportType metadata.
     */
    protected function resolveReportTypeInfo(string $filename): array
    {
        $upper = strtoupper($filename);

        if (str_contains($upper, 'FYP') || str_contains($upper, 'PROJECT')) {
            return [
                'code' => 'FYP',
                'name' => 'Final Year Project Report',
                'description' => 'Comprehensive final year undergraduate/diploma capstone research project.',
            ];
        }

        if (str_contains($upper, 'DISSERTATION') || str_contains($upper, 'THESIS')) {
            return [
                'code' => 'DISSERTATION',
                'name' => 'Master\'s Dissertation / Thesis',
                'description' => 'Postgraduate academic dissertation research study.',
            ];
        }

        return [
            'code' => 'FIELDWORK',
            'name' => 'Field Practical Training Report (IPT)',
            'description' => 'Industrial / Practical Training Attachment Report documenting experiential learning.',
        ];
    }

    /**
     * Extract sections and formatting guidelines from file.
     */
    protected function extractStructure(string $filePath, string $extension, string $filename, array $institution): array
    {
        $headings = [];

        if ($extension === 'docx') {
            $headings = $this->parseDocxHeadings($filePath);
        }

        $sections = $this->resolveStandardSections($institution['short_name'], $headings);

        $formatting = [
            'font' => [
                'family' => 'Times New Roman',
                'body_size' => 12,
                'heading_1_size' => 14,
                'heading_2_size' => 12,
            ],
            'spacing' => [
                'line_spacing' => 1.5,
                'paragraph_after' => 6,
            ],
            'margins' => [
                'top' => 1.0,
                'bottom' => 1.0,
                'left' => 1.5,
                'right' => 1.0,
                'unit' => 'inch',
            ],
            'numbering' => [
                'preliminaries' => 'roman', // i, ii, iii
                'body' => 'arabic', // 1, 2, 3
            ],
            'citation' => 'Harvard (Author-Date) / APA 7th',
        ];

        return [
            'sections' => $sections,
            'formatting' => $formatting,
            'raw_headings' => $headings,
        ];
    }

    /**
     * Extract text headings from DOCX document.xml.
     */
    protected function parseDocxHeadings(string $docxPath): array
    {
        $headings = [];
        $zip = new ZipArchive();

        if ($zip->open($docxPath) === true) {
            $content = $zip->getFromName('word/document.xml');
            $zip->close();

            if ($content) {
                // Match paragraphs that look like headings or uppercase chapters
                preg_match_all('/<w:p\b[^>]*>(.*?)<\/w:p>/is', $content, $paragraphs);
                foreach ($paragraphs[1] as $p) {
                    $clean = trim(html_entity_decode(strip_tags($p)));
                    if (empty($clean) || strlen($clean) > 120) {
                        continue;
                    }

                    // Check for Chapter or Section indicators
                    if (preg_match('/^(CHAPTER|SECTION|\d+\.\d+|PRELIMINAR|DECLARATION|ACKNOWLEDG|EXECUTIVE|TABLE OF CONTENTS|REFERENCES|APPENDI)/i', $clean)) {
                        $headings[] = $clean;
                    }
                }
            }
        }

        return array_values(array_unique($headings));
    }

    /**
     * Resolve institutional chapter sequence.
     */
    protected function resolveStandardSections(string $shortName, array $discoveredHeadings = []): array
    {
        switch ($shortName) {
            case 'UDSM':
                return [
                    [
                        'title' => 'Preliminary Pages (Cover, Declaration, Certification, Acknowledgements, Abstract, Table of Contents)',
                        'description' => 'University title block, student registration, host firm endorsement, and executive summary.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 1: INTRODUCTION AND BACKGROUND OF THE HOST ORGANIZATION',
                        'description' => 'Historical background, vision, mission, core values, organizational structure, and departmental roles.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 2: OPERATIONAL STRUCTURE AND ACTIVITIES PERFORMED',
                        'description' => 'Detailed routine activities, assigned rotations, tools/technologies utilized, and workflows observed.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 3: TECHNICAL TASKS, SKILLS ACQUIRED, AND APPLIED METHODOLOGIES',
                        'description' => 'In-depth analysis of technical assignments, hands-on engineering/software/business tasks, and classroom theory application.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 4: CHALLENGES FACED, PROBLEM SOLVING, AND LESSONS LEARNED',
                        'description' => 'Critical evaluation of operational hurdles encountered, innovative problem-solving strategies, and key professional takeaways.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 5: CONCLUSION AND ACTIONABLE RECOMMENDATIONS',
                        'description' => 'Synthesis of field training outcomes, recommendations for host company enhancement, and curricular suggestions for UDSM.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'REFERENCES AND APPENDICES',
                        'description' => 'Academic references (APA/Harvard), weekly logbook verification copies, system diagrams, and clearance letters.',
                        'is_required' => true,
                    ],
                ];

            case 'IFM':
                return [
                    [
                        'title' => 'Preliminaries (Declaration, Dedication, Acknowledgements, Abstract, Table of Contents, List of Abbreviations)',
                        'description' => 'Standard IFM academic front matter and formal student declaration.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 1: INTRODUCTION OF THE HOST ORGANIZATION',
                        'description' => 'Establishment history, regulatory framework, financial/operational standing, and organogram.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 2: PRACTICAL EXPERIENCES AND DUTIES ASSIGNED',
                        'description' => 'Day-to-day operations, financial systems/IT setups, banking or audit processes participated in.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 3: ANALYSIS OF KNOWLEDGE ACQUIRED AND SKILLS DEVELOPED',
                        'description' => 'Comparison between IFM syllabus modules and workplace real-world systems, professional ethics gained.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 4: CHALLENGES, LIMITATIONS, AND PROBLEM SOLVING',
                        'description' => 'Operational limitations, institutional challenges, mitigation methods applied.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 5: CONCLUSION AND RECOMMENDATIONS',
                        'description' => 'Overall evaluation, recommendations to the host institution and to IFM faculty.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'REFERENCES AND APPENDICES',
                        'description' => 'Harvard formatted references, IFM logbook forms, approval letters.',
                        'is_required' => true,
                    ],
                ];

            case 'CBE':
                return [
                    [
                        'title' => 'Preliminary Pages (Cover Page, Declaration, Letter of Transmittal, Acknowledgements, Executive Summary)',
                        'description' => 'College of Business Education official transmittal letter and student identification.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 1: BACKGROUND OF THE FIELD ATTACHMENT ORGANIZATION',
                        'description' => 'Location, corporate objectives, products/services, target market, management structure.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 2: ACTIVITIES AND TASKS ACCOMPLISHED',
                        'description' => 'Specific projects, accounting/marketing/procurement activities, and routine workflows.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 3: RELEVANCE OF ACADEMIC COURSES TO FIELD WORK',
                        'description' => 'Linking theoretical CBE business modules to practical enterprise scenarios.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 4: CHALLENGES ENCOUNTERED AND SOLUTIONS',
                        'description' => 'Resource constraints, work culture adjustments, and solutions implemented.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 5: SUMMARY, CONCLUSIONS, AND RECOMMENDATIONS',
                        'description' => 'Strategic recommendations to management and constructive suggestions to CBE.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'APPENDICES',
                        'description' => 'Supervisor assessment forms, logbook attachments, sample documents handled.',
                        'is_required' => true,
                    ],
                ];

            case 'ARU':
                return [
                    [
                        'title' => 'Preliminary Pages (Certification, Declaration, Acknowledgements, Abstract, Table of Contents, Lists of Tables/Figures)',
                        'description' => 'Ardhi University technical report submission requirements and endorsement pages.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 1: ORGANIZATIONAL OVERVIEW & DEPARTMENTAL SETUP',
                        'description' => 'Host organization overview, ICT/Geospatial/Environmental infrastructure, department responsibilities.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 2: SYSTEM ARCHITECTURE, IT INFRASTRUCTURE & MAIN TASKS',
                        'description' => 'Detailed analysis of server/network environments, database configurations, hardware and software deployment.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 3: HANDS-ON TECHNICAL IMPLEMENTATIONS & PROJECTS',
                        'description' => 'Programming, network troubleshooting, system design, data collection, and applied field tasks.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 4: EVALUATION, CHALLENGES & TECHNICAL COMPETENCIES',
                        'description' => 'Technical troubleshooting, system bottlenecks, competencies acquired, theory vs practice review.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 5: CONCLUSIONS & STRATEGIC RECOMMENDATIONS',
                        'description' => 'Summary of technical findings, system upgrade proposals, and academic reflections.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'REFERENCES AND APPENDICES',
                        'description' => 'IEEE/APA references, system architecture diagrams, logbook evidence sheets.',
                        'is_required' => true,
                    ],
                ];

            case 'NIT':
                return [
                    [
                        'title' => 'Preliminary Information (Cover Page, Declaration, Approval Page, Acknowledgements, Executive Summary)',
                        'description' => 'NIT official industrial attachment certification and introductory preliminaries.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 1: INSTITUTIONAL PROFILE & DEPARTMENTAL OPERATIONS',
                        'description' => 'Transport/logistics/engineering profile, corporate structure, fleet/workshop operations.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 2: DESCRIPTION OF WORK CARRIED OUT & TECHNOLOGY USED',
                        'description' => 'Practical maintenance, logistics tracking, operations management, and assigned duties.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 3: ACADEMIC THEORY APPLICATION & SKILLS GAINED',
                        'description' => 'Bridging NIT academic coursework with transport/engineering/IT industry practices.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 4: OPERATIONAL BOTTLENECKS & PRACTICAL SOLUTIONS',
                        'description' => 'Diagnostic challenges, equipment/supply shortages, safety protocols, and remedies.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 5: SUMMARY AND POLICY RECOMMENDATIONS',
                        'description' => 'Industry recommendations, equipment maintenance advice, and curriculum insights.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'APPENDICES & FIELD ENDORSEMENT',
                        'description' => 'Daily log sheets, industrial supervisor appraisal, maintenance schedules.',
                        'is_required' => true,
                    ],
                ];

            default:
                return [
                    [
                        'title' => 'Preliminary Pages (Title Page, Declaration, Acknowledgements, Abstract, Table of Contents)',
                        'description' => 'Standard Tanzanian academic report preliminary front matter.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 1: INTRODUCTION AND ORGANIZATIONAL PROFILE',
                        'description' => 'General background, organizational structure, objectives, and departmental mission.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 2: FIELD ATTACHMENT ACTIVITIES AND DUTIES',
                        'description' => 'Comprehensive description of tasks, projects, tools, and technical duties executed.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 3: APPLIED SKILLS, THEORY RELEVANCE, AND EXPERIENCES',
                        'description' => 'Reflection on classroom knowledge applied to industry practice and skills mastered.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 4: CHALLENGES ENCOUNTERED AND PROBLEM SOLVING',
                        'description' => 'Obstacles faced during field attachment and strategies adopted to solve them.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'CHAPTER 5: CONCLUSIONS AND RECOMMENDATIONS',
                        'description' => 'Concluding evaluation, recommendations to the host organization, and advice to university.',
                        'is_required' => true,
                    ],
                    [
                        'title' => 'REFERENCES AND APPENDICES',
                        'description' => 'Citations, logbook records, and supporting field documentation.',
                        'is_required' => true,
                    ],
                ];
        }
    }
}
