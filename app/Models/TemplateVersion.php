<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TemplateVersion extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'template_id',
        'version_number',
        'effective_date',
        'status', // draft, discovered, review, verified, published, archived
        'file_path',
        'file_format',
        'checksum',
        'file_size',
        'metadata',
        'verified_at',
        'published_at',
    ];

    protected $casts = [
        'effective_date' => 'date',
        'metadata' => 'array',
        'verified_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(TemplateSection::class)->orderBy('order');
    }

    public function formattingRules(): HasMany
    {
        return $this->hasMany(FormattingRule::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}

