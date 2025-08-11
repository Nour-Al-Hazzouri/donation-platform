<?php

namespace App\Http\Requests;

use App\Models\DonationEvent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDonationTransactionRequest extends FormRequest
{
    /**
     * The donation event instance.
     *
     * @var \App\Models\DonationEvent
     */
    protected $event;

    /**
     * The type of transaction.
     *
     * @var string
     */
    protected $transactionType;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
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
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
                function ($attribute, $value, $fail) {
                    if (!$this->event) {
                        return;
                    }
                    
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
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        // Get the event from the route
        $this->event = $this->route('donationEvent');
        
        // Set transaction type based on event type
        $this->transactionType = $this->event->type === 'request' ? 'contribution' : 'claim';
        
        // Validate event status
        if ($this->event->status !== 'active') {
            abort(422, 'The selected event is not active.');
        }
        
        // Set default transaction time to now if not provided
        if (!$this->has('transaction_at')) {
            $this->merge([
                'transaction_at' => now(),
            ]);
        }
    }

    /**
     * Get the transaction type determined by the event type.
     *
     * @return string
     */
    public function getTransactionType(): string
    {
        return $this->transactionType;
    }

    /**
     * Get the event instance.
     *
     * @return \App\Models\DonationEvent
     */
    public function getEvent(): DonationEvent
    {
        return $this->event;
    }
}
