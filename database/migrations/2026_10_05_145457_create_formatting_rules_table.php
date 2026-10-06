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
        Schema::create('formatting_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('template_version_id')->constrained()->cascadeOnDelete();
            $table->string('rule_type'); 
            $table->json('configuration');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formatting_rules');
    }
};
