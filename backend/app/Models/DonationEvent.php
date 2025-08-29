<?php

namespace App\Models;

use App\Services\ImageService;
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
        'image_urls',
        'goal_amount',
        'current_amount',
        'possible_amount',
        'type',
        'status'
    ];

    protected $appends = ['image_full_urls'];

    protected $casts = [
        'image_urls' => 'array',
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

    /**
     * Get the image URLs with full paths
     *
     * @return array
     */
    public function getImageFullUrlsAttribute(): array
    {
        if (empty($this->image_urls)) {
            return [];
        }

        return array_map(function ($image) {
            return app(ImageService::class)->getImageUrl($image, true);
        }, $this->image_urls);
    }

    /**
     * Get the image paths (without full URL)
     *
     * @return array
     */
    public function getImageUrlsAttribute($value)
    {
        if (empty($value)) {
            return [];
        }

        if (is_string($value)) {
            return json_decode($value, true) ?? [];
        }

        return $value ?? [];
    }

    /**
     * Set the image paths
     *
     * @param  mixed  $value
     * @return void
     */
    public function setImageUrlsAttribute($value)
    {
        if (is_string($value)) {
            $value = json_decode($value, true);
        }

        $this->attributes['image_urls'] = json_encode(array_values(array_filter((array) $value)));
    }

    public function moderationReports(): MorphMany
    {
        return $this->morphMany(ModerationReport::class, 'reportable');
    }
}
