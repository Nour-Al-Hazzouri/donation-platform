<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotificationType extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    // Relationships
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'type_id');
    }
}
