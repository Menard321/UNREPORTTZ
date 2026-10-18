<?php

namespace App\Console\Commands;

use App\Services\TemplateDiscoveryService;
use Illuminate\Console\Command;

class SyncTemplatesCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'unireport:templates-sync {--dry-run : Discover templates without modifying the database}';

    /**
     * The console command description.
     */
    protected $description = 'Scan authoritative university templates directory, extract structures, and synchronize database records.';

    /**
     * Execute the console command.
     */
    public function handle(TemplateDiscoveryService $discoveryService): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $path = config('unireport.templates_path', base_path('templates'));

        $this->info("================================================================================");
        $this->info("UniReportTZ — Institutional Template Discovery & Synchronization");
        $this->info("================================================================================");
        $this->line("Target Directory : <comment>{$path}</comment>");
        $this->line("Mode             : " . ($dryRun ? '<fg=yellow;options=bold>DRY RUN (No DB mutations)</>' : '<fg=green;options=bold>LIVE SYNC</>'));
        $this->newLine();

        $results = $discoveryService->sync($dryRun);

        if (empty($results['items'])) {
            $this->warn("No matching .docx or .pdf templates discovered in {$path}");
            return Command::FAILURE;
        }

        $headers = ['Filename', 'Institution', 'Report Type', 'Format', 'Checksum', 'Sections', 'Sync Status'];
        $rows = array_map(function ($item) {
            return [
                $item['filename'],
                $item['university'],
                $item['report_type'],
                strtoupper($item['format']),
                $item['checksum'],
                $item['sections_count'],
                $item['sync_status'],
            ];
        }, $results['items']);

        $this->table($headers, $rows);

        $this->newLine();
        $this->info("Synchronization Summary:");
        $this->line(" - Files Discovered     : <info>{$results['scanned_count']}</info>");
        $this->line(" - Universities Created : <info>{$results['universities_synced']}</info>");
        $this->line(" - Report Types Created : <info>{$results['report_types_synced']}</info>");
        $this->line(" - Templates Synchronized: <info>{$results['templates_synced']}</info>");
        $this->line(" - Versions Synchronized: <info>{$results['versions_synced']}</info>");
        $this->line(" - Sections Registered  : <info>{$results['sections_synced']}</info>");

        if ($dryRun) {
            $this->newLine();
            $this->warn("[DRY RUN COMPLETE] Run without --dry-run to commit records to the PostgreSQL database.");
        } else {
            $this->newLine();
            $this->info("[SUCCESS] University templates are active and available for report generation.");
        }

        return Command::SUCCESS;
    }
}
