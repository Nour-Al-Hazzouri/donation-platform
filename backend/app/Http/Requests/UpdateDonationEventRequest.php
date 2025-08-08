<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDonationEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'location_id' => 'sometimes|exists:locations,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'goal_amount' => 'sometimes|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'type' => 'sometimes|in:request,offer',
            'status' => 'sometimes|in:active,completed,cancelled,suspended',
            'current_amount' => 'sometimes|numeric|min:0',
            'possible_amount' => 'sometimes|numeric|min:0',
        ];
    }
}
