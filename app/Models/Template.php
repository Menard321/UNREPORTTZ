<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Template extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'description',
        'university_id',
        'report_type_id',
        'status', // draft, review, verified, published, archived
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function reportType(): BelongsTo
    {
        return $this->belongsTo(ReportType::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(TemplateVersion::class);
    }

    public function publishedVersion(): HasOne
    {
        return $this->hasOne(TemplateVersion::class)->where('status', 'published')->latest('created_at');
    }

    public function latestVersion(): HasOne
    {
        return $this->hasOne(TemplateVersion::class)->latest('created_at');
    }
}

