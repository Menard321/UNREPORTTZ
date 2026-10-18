<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'short_name',
        'logo_path',
        'location',
        'status',
    ];

    public function templates(): HasMany
    {
        return $this->hasMany(Template::class);
    }

    public function colleges(): HasMany
    {
        return $this->hasMany(College::class);
    }
}

