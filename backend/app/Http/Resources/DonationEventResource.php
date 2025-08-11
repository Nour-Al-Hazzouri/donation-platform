<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DonationEventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'goal_amount' => $this->goal_amount,
            'current_amount' => $this->current_amount,
            'possible_amount' => $this->possible_amount,
            'type' => $this->type,
            'status' => $this->status,
            'image_urls' => $this->image_urls ?? [],
            'image_full_urls' => $this->image_full_urls ?? [],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

        // Add user relationship if loaded
        if ($this->relationLoaded('user') && $this->user) {
            $data['user'] = [
                'id' => $this->user->id,
                'username' => $this->user->username,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
                'avatar' => $this->user->profile_photo_url ?? null,
            ];
        } elseif ($this->user_id) {
            $data['user_id'] = $this->user_id;
        }

        // Add location relationship if loaded
        if ($this->relationLoaded('location') && $this->location) {
            $data['location'] = [
                'id' => $this->location->id,
                'governorate' => $this->location->governorate,
                'district' => $this->location->district,
            ];
        } elseif ($this->location_id) {
            $data['location_id'] = $this->location_id;
        }

        return $data;
    }
}
