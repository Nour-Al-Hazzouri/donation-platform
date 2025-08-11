<?php

namespace App\Models;

use App\Services\ImageService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\App;

class Verification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'verifier_id',
        'document_type',
        'image_urls',
        'status',
        'notes',
        'verified_at'
    ];

    protected $appends = [
        'image_full_urls',
    ];

    protected $casts = [
        'image_urls' => 'array',
        'verified_at' => 'datetime',
    ];

    // Accessors & Mutators
    public function getImageUrlsAttribute($value)
    {
        if (is_string($value)) {
            $value = json_decode($value, true) ?: [];
        }

        return is_array($value) ? $value : [];
    }

    public function setImageUrlsAttribute($value)
    {
        $this->attributes['image_urls'] = is_array($value) ? json_encode($value) : $value;
    }

    public function getImageFullUrlsAttribute()
    {
        $imageService = App::make(ImageService::class);
        $urls = [];

        foreach ($this->image_urls as $path) {
            // For verification documents, we don't generate thumbnails for privacy reasons
            $urls[] = [
                'original' => $imageService->getImageUrl($path, false), // false for private storage
            ];
        }

        return $urls;
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verifier_id');
    }

    public function moderationReports(): MorphMany
    {
        return $this->morphMany(ModerationReport::class, 'reportable');
    }

    // Helper Methods
    public function addImage($file)
    {
        $imageService = App::make(ImageService::class);
        $path = $imageService->uploadImage($file, 'verifications');

        if ($path) {
            $currentImages = $this->image_urls;
            $currentImages[] = $path;
            $this->image_urls = $currentImages;
            $this->save();
            return $path;
        }

        return false;
    }

    public function deleteImages()
    {
        $imageService = App::make(ImageService::class);

        foreach ($this->image_urls as $path) {
            $imageService->deleteImage($path, false);
        }

        $this->image_urls = [];
        $this->save();
    }

    protected static function booted()
    {
        static::deleting(function ($verification) {
            // Delete all associated images when verification is deleted
            $verification->deleteImages();
        });
    }
}
