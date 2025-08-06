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
            'user_id' => $this->user_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
        if ($this->relationLoaded('user') && $this->user) {
            $data['user'] = new UserResource($this->user);
        } elseif ($this->user_id) {
            $data['user_id'] = $this->user_id;
        }
        if ($this->relationLoaded('location') && $this->location) {
            $data['location'] = [
                'id' => $this->location->id,
                'governorate' => $this->location->governorate,
                'district' => $this->location->district,
            ];
        } elseif ($this->location_id) {
            $data['location_id'] = $this->location_id;
        }
        $data['images'] = $this->images;
        return $data;
    }
}
