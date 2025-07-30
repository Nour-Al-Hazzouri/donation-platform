<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
class DonationTransaction extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
        'transaction_type',
        'amount',
        'status',
        'transaction_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'transaction_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(DonationEvent::class, 'event_id');
    }

    public function moderationReports(): MorphMany
    {
        return $this->morphMany(ModerationReport::class, 'reportable');
    }
}
