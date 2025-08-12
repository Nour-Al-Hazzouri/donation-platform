<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Services\ImageService;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'avatar_url',
        'location_id',
        'is_verified',
        'role'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['avatar_url_full'];

    /**
     * Get the full URL for the user's avatar.
     *
     * @return string|null
     */
    public function getAvatarUrlFullAttribute(): ?string
    {
        if (!$this->avatar_url) {
            return null;
        }

        return app(ImageService::class)->getImageUrl($this->avatar_url);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_verified' => 'boolean',
    ];

    /**
     * Send the password reset notification with a log-friendly link.
     */
    public function sendPasswordResetNotification($token)
    {
        $url = url('/reset-password/' . $token . '?email=' . urlencode($this->email));
        \Log::info('Password reset link: ' . $url);
        $this->notify(new \Illuminate\Auth\Notifications\ResetPassword($token));
    }

    // Relationships
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function donationEvents(): HasMany
    {
        return $this->hasMany(DonationEvent::class, 'user_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(DonationTransaction::class, 'user_id');
    }

    public function communityPosts(): HasMany
    {
        return $this->hasMany(CommunityPost::class, 'user_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'user_id');
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class, 'user_id');
    }

    public function verifications(): HasMany
    {
        return $this->hasMany(Verification::class, 'user_id');
    }

    public function handledVerifications(): HasMany
    {
        return $this->hasMany(Verification::class, 'verifier_id');
    }

    public function submittedReports(): HasMany
    {
        return $this->hasMany(ModerationReport::class, 'reporter_id');
    }

    public function resolvedReports(): HasMany
    {
        return $this->hasMany(ModerationReport::class, 'resolved_by');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function unreadNotifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id')->whereNull('read_at');
    }

    public function readNotifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id')->whereNotNull('read_at');
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class, 'user_id');
    }
}
