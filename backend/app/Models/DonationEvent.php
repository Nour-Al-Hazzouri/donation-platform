<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DonationEvent extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'location_id',
        'title',
        'description',
        'images',
        'goal_amount',
        'current_amount',
        'possible_amount',
        'type',
        'status'
    ];

    protected $casts = [
        'images' => 'array',
        'goal_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'possible_amount' => 'decimal:2',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(DonationTransaction::class, 'event_id');
    }

    public function communityPosts(): HasMany
    {
        return $this->hasMany(CommunityPost::class, 'event_id');
    }

    public function moderationReports(): MorphMany
    {
        return $this->morphMany(ModerationReport::class, 'reportable');
    }
}
