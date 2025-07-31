<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NotificationType extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'template',
    ];

    // Relationships
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'type_id');
    }
}
