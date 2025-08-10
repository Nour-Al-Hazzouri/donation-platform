<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\DonationEvent;

class StoreDonationTransactionRequest extends FormRequest
{
    protected $event;
    protected $transactionType;

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
            'event_id' => [
                'required',
                'exists:donation_events,id',
                // Ensure the event exists and is active
                function ($attribute, $value, $fail) {
                    $this->event = DonationEvent::find($value);
                    
                    if (!$this->event) {
                        return $fail('The selected event does not exist.');
                    }
                    
                    if ($this->event->status !== 'active') {
                        $fail('The selected event is not active.');
                    }
                    
                    // Set transaction type based on event type
                    $this->transactionType = $this->event->type === 'request' ? 'contribution' : 'claim';
                },
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
                function ($attribute, $value, $fail) {
                    if (!$this->event) return;
                    
                    // For claim transactions, check if amount is available
                    if ($this->transactionType === 'claim' && $value > $this->event->current_amount) {
                        $fail('The claim amount cannot exceed the current available amount.');
                    }
                },
            ],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    /**
     * Get the transaction type determined by the event type
     *
     * @return string
     */
    public function getTransactionType()
    {
        return $this->transactionType;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Set default transaction time to now if not provided
        if (!$this->has('transaction_at')) {
            $this->merge([
                'transaction_at' => now(),
            ]);
        }
    }
}
