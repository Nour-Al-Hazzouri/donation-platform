<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'username' => $this->username,
            'email' => $this->email,
            'phone' => $this->phone,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

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
