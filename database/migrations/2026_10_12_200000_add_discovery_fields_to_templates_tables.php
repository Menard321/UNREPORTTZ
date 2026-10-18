<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('universities', function (Blueprint $table) {
            if (!Schema::hasColumn('universities', 'short_name')) {
                $table->string('short_name')->nullable()->after('name');
            }
        });

        Schema::table('report_types', function (Blueprint $table) {
            if (!Schema::hasColumn('report_types', 'code')) {
                $table->string('code')->nullable()->after('name');
            }
        });

        Schema::table('templates', function (Blueprint $table) {
            if (!Schema::hasColumn('templates', 'code')) {
                $table->string('code')->nullable()->after('name');
            }
            if (!Schema::hasColumn('templates', 'description')) {
                $table->text('description')->nullable()->after('code');
            }
        });

        Schema::table('template_versions', function (Blueprint $table) {
            if (!Schema::hasColumn('template_versions', 'file_path')) {
                $table->string('file_path')->nullable()->after('version_number');
            }
            if (!Schema::hasColumn('template_versions', 'file_format')) {
                $table->string('file_format')->default('docx')->after('file_path');
            }
            if (!Schema::hasColumn('template_versions', 'checksum')) {
                $table->string('checksum')->nullable()->after('file_format');
            }
            if (!Schema::hasColumn('template_versions', 'file_size')) {
                $table->bigInteger('file_size')->nullable()->after('checksum');
            }
            if (!Schema::hasColumn('template_versions', 'metadata')) {
                $table->json('metadata')->nullable()->after('file_size');
            }
            if (!Schema::hasColumn('template_versions', 'verified_at')) {
                $table->timestamp('verified_at')->nullable()->after('status');
            }
            if (!Schema::hasColumn('template_versions', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('verified_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('template_versions', function (Blueprint $table) {
            $table->dropColumn(['file_path', 'file_format', 'checksum', 'file_size', 'metadata', 'verified_at', 'published_at']);
        });

        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn(['code', 'description']);
        });

        Schema::table('report_types', function (Blueprint $table) {
            $table->dropColumn(['code']);
        });

        Schema::table('universities', function (Blueprint $table) {
            $table->dropColumn(['short_name']);
        });
    }
};
