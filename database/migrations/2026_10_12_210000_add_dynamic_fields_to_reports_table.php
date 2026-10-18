<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (!Schema::hasColumn('reports', 'university_id')) {
                $table->foreignUuid('university_id')->nullable()->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('reports', 'report_type_id')) {
                $table->foreignUuid('report_type_id')->nullable()->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('reports', 'current_step')) {
                $table->integer('current_step')->default(1);
            }
            if (!Schema::hasColumn('reports', 'progress_percentage')) {
                $table->integer('progress_percentage')->default(0);
            }
            if (!Schema::hasColumn('reports', 'metadata')) {
                $table->json('metadata')->nullable();
            }
        });

        Schema::table('report_sections', function (Blueprint $table) {
            if (!Schema::hasColumn('report_sections', 'order')) {
                $table->integer('order')->default(0);
            }
            if (!Schema::hasColumn('report_sections', 'word_count')) {
                $table->integer('word_count')->default(0);
            }
            if (!Schema::hasColumn('report_sections', 'metadata')) {
                $table->json('metadata')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropForeign(['university_id']);
            $table->dropForeign(['report_type_id']);
            $table->dropColumn(['university_id', 'report_type_id', 'current_step', 'progress_percentage', 'metadata']);
        });

        Schema::table('report_sections', function (Blueprint $table) {
            $table->dropColumn(['order', 'word_count', 'metadata']);
        });
    }
};
