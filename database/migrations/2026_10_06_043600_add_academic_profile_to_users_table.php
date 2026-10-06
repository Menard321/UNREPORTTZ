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
        Schema::table('users', function (Blueprint $table) {
            $table->string('university_id')->nullable()->change();
            $table->string('department_id')->nullable()->change();
            $table->string('programme_id')->nullable()->change();

            if (!Schema::hasColumn('users', 'college_id')) {
                $table->string('college_id')->nullable();
            } else {
                $table->string('college_id')->nullable()->change();
            }

            if (!Schema::hasColumn('users', 'programme_name')) {
                $table->string('programme_name')->nullable();
            }
            if (!Schema::hasColumn('users', 'reg_number')) {
                $table->string('reg_number')->nullable();
            }
            if (!Schema::hasColumn('users', 'graduation_year')) {
                $table->string('graduation_year')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['college_id', 'programme_name', 'reg_number', 'graduation_year']);
        });
    }
};
