<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;

class VerificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isAdmin = $request->user() && $request->user()->hasRole('admin');

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'verifier_id' => $this->verifier_id,
            'document_type' => $this->document_type,
            'status' => $this->status,
            'notes' => $this->when($isAdmin || $this->status !== 'pending', $this->notes),
            'verified_at' => $this->when($this->verified_at, $this->verified_at?->toDateTimeString()),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),

            // Include image URLs
            'image_urls' => $this->image_urls,
            'image_full_urls' => $this->when($this->relationLoaded('user') || $isAdmin, $this->image_full_urls),

            // Relationships
            'user' => $this->when($this->relationLoaded('user'), function () {
                return new UserResource($this->user);
            }),
            'verifier' => $this->when($this->relationLoaded('user'), function () {
                return new UserResource($this->user);
            }),
        ];
    }
}
