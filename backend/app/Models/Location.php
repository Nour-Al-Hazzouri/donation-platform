<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Location extends Model
{
    use HasFactory;
    protected $fillable = ['governorate', 'district'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'location_id');
    }

    public function donationEvents(): HasMany
    {
        return $this->hasMany(DonationEvent::class, 'location_id');
    }
}
