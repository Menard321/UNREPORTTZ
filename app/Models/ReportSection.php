<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportSection extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'report_id',
        'template_section_id',
        'title',
        'content',
        'order',
        'status', // pending, drafting, completed
        'word_count',
        'metadata',
    ];

    protected $casts = [
        'order' => 'integer',
        'word_count' => 'integer',
        'metadata' => 'array',
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }

    public function templateSection(): BelongsTo
    {
        return $this->belongsTo(TemplateSection::class);
    }
}

