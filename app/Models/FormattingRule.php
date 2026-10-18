<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormattingRule extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'template_version_id',
        'rule_type',
        'configuration',
    ];

    protected $casts = [
        'configuration' => 'array',
    ];

    public function templateVersion(): BelongsTo
    {
        return $this->belongsTo(TemplateVersion::class);
    }
}

