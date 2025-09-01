<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled by the controller/middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'username' => 'sometimes|required|string|min:3|max:255|unique:users,username,' . $this->user()->id,
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $this->user()->id,
            'phone' => 'nullable|string|max:15',
            'location_id' => 'sometimes|nullable|exists:locations,id',
            'avatar_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'delete_avatar' => 'sometimes|nullable|string|in:true,false',
        ];
    }
}
