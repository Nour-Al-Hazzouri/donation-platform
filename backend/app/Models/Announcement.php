<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\ImageService;

class Announcement extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title',
        'content',
        'priority',
        'image_urls',
        'user_id'
    ];

    protected $appends = ['image_full_urls'];

    protected $casts = [
        'image_urls' => 'array',
        'priority' => 'string'
    ];

    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';

    public static function getPriorities(): array
    {
        return [
            self::PRIORITY_LOW,
            self::PRIORITY_MEDIUM,
            self::PRIORITY_HIGH,
        ];
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
            return app(ImageService::class)->getImageUrl($image);
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
}
