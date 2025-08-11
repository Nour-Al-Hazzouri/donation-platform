<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class DonationTransaction extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'event_id',
        'transaction_type',
        'amount',
        'status',
        'transaction_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'transaction_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['description'];

    /**
     * Get the user that owns the transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the event that the transaction belongs to.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(DonationEvent::class, 'event_id');
    }

    /**
     * Get all of the moderation reports for the transaction.
     */
    public function moderationReports(): MorphMany
    {
        return $this->morphMany(ModerationReport::class, 'reportable');
    }

    /**
     * Get a human-readable description of the transaction.
     *
     * @return string
     */
    public function getDescriptionAttribute(): string
    {
        return $this->transaction_type === 'contribution'
            ? 'Contribution to ' . $this->event->title
            : 'Claim from ' . $this->event->title;
    }
}
