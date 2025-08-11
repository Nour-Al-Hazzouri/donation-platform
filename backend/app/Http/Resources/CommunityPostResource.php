<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommunityPostResource extends JsonResource
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
            'content' => $this->content,
            'image_urls' => $this->image_urls,
            'image_full_urls' => $this->image_full_urls,
            'tags' => $this->tags ?? [],
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'votes' => $this->when($this->relationLoaded('votes'), function () {
                $upvotes = $this->votes->where('type', 'upvote')->count();
                $downvotes = $this->votes->where('type', 'downvote')->count();
                $total = $upvotes - $downvotes;
                $userVote = $this->votes->firstWhere('user_id', auth()->id())?->type;
                return [
                    'upvotes' => $upvotes,
                    'downvotes' => $downvotes,
                    'total' => $total,
                    'user_vote' => $userVote
                ];
            }),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'username' => $this->user->username,
                    'first_name' => $this->user->first_name,
                    'last_name' => $this->user->last_name,
                    'avatar' => $this->user->profile_photo_url ?? null,
                ];
            }),
            'event' => $this->whenLoaded('event', function () {
                return [
                    'id' => $this->event->id,
                    'title' => $this->event->title,
                ];
            }),
            'votes_count' => $this->when(isset($this->votes_count), $this->votes_count, function () {
                return $this->whenLoaded('votes', function () {
                    return $this->votes->count();
                }, 0);
            }),
            'comments_count' => $this->when(isset($this->comments_count), $this->comments_count, function () {
                return $this->whenLoaded('comments', function () {
                    return $this->comments->count();
                }, 0);
            }),
            'comments' => $this->whenLoaded('comments', function () {
                return CommentResource::collection($this->comments->load('user'));
            }),
        ];
    }
}
