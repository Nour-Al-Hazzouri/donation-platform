<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\ImageService;

class CommunityPost extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'event_id',
        'content',
        'image_urls',
        'tags'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'image_urls' => 'array',
        'tags' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['image_full_urls'];

    /**
     * Get the full URLs for the post images.
     *
     * @return array
     */
    public function getImageFullUrlsAttribute(): array
    {
        if (empty($this->image_urls)) {
            return [];
        }

        return array_map(function ($imagePath) {
            return app(ImageService::class)->getImageUrl($imagePath, true);
        }, $this->image_urls);
    }



    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(DonationEvent::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'post_id');
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class, 'post_id');
    }

    /**
     * Get the upvotes count for the post.
     *
     * @return int
     */
    public function getUpvotesCountAttribute()
    {
        if (!array_key_exists('upvotes_count', $this->attributes)) {
            $this->loadCount([
                'votes as upvotes_count' => function ($query) {
                    $query->where('type', 'upvote');
                }
            ]);
        }
        return $this->upvotes_count;
    }

    /**
     * Get the downvotes count for the post.
     *
     * @return int
     */
    public function getDownvotesCountAttribute()
    {
        if (!array_key_exists('downvotes_count', $this->attributes)) {
            $this->loadCount([
                'votes as downvotes_count' => function ($query) {
                    $query->where('type', 'downvote');
                }
            ]);
        }
        return $this->downvotes_count;
    }

    /**
     * Get the total votes (upvotes - downvotes) for the post.
     *
     * @return int
     */
    public function getTotalVotesAttribute()
    {
        return $this->upvotes_count - $this->downvotes_count;
    }

    /**
     * Get the current user's vote on the post.
     *
     * @return string|null
     */
    public function getUserVoteAttribute()
    {
        if (auth()->check()) {
            $vote = $this->votes()->where('user_id', auth()->id())->first();
            return $vote ? $vote->type : null;
        }
        return null;
    }

    public function moderationReports(): MorphMany
    {
        return $this->morphMany(ModerationReport::class, 'reportable');
    }
}
