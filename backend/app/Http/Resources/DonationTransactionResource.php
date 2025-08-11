<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DonationTransactionResource extends JsonResource
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
            'transaction_type' => $this->transaction_type,
            'amount' => (float) $this->amount,
            'status' => $this->status,
            'transaction_at' => $this->transaction_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

        // Include user relationship if loaded
        if ($this->relationLoaded('user') && $this->user) {
            $data['user'] = new UserResource($this->user);
        } elseif ($this->user_id) {
            $data['user_id'] = $this->user_id;
        }

        // Include event relationship if loaded
        if ($this->relationLoaded('event') && $this->event) {
            $data['event'] = new DonationEventResource($this->event);
        } elseif ($this->event_id) {
            $data['event_id'] = $this->event_id;
        }

        // Include moderation reports if loaded
        if ($this->relationLoaded('moderationReports')) {
            $data['moderation_reports'] = ModerationReportResource::collection($this->whenLoaded('moderationReports'));
        }

        return $data;
    }
}
