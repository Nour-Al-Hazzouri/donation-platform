<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'message' => $this->message,
            'data' => $this->data ?? [],
            'is_read' => !is_null($this->read_at),
            'read_at' => $this->read_at?->toDateTimeString(),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'type' => $this->whenLoaded('type', function () {
                return [
                    'id' => $this->type->id,
                    'name' => $this->type->name,
                    'description' => $this->type->description,
                ];
            }),
            // The user who owns/receives the notification
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'username' => $this->user->username,
                    'first_name' => $this->user->first_name,
                    'last_name' => $this->user->last_name,
                    'avatar' => $this->user->profile_photo_url ?? null,
                ];
            }),
            // Related user who triggered the notification (if any)
            'related_user' => $this->when(
                !empty($this->data['user_id'] ?? null),
                function () {
                    $relatedUser = \App\Models\User::find($this->data['user_id']);
                    return $relatedUser ? [
                        'id' => $relatedUser->id,
                        'username' => $relatedUser->username,
                        'first_name' => $relatedUser->first_name,
                        'last_name' => $relatedUser->last_name,
                        'avatar' => $relatedUser->profile_photo_url ?? null,
                    ] : null;
                }
            ),
        ];
    }
}
