<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\DonationTransaction;
use App\Models\DonationEvent;
use App\Http\Resources\DonationTransactionResource;
use App\Http\Requests\StoreDonationTransactionRequest;
use App\Http\Requests\UpdateTransactionStatusRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DonationTransactionController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', DonationTransaction::class);
        $transactions = DonationTransaction::with(['user', 'event'])
            ->where('user_id', auth()->id())
            ->orWhereHas('event', function($query) {
                $query->where('user_id', auth()->id());
            })
            ->latest()
            ->paginate(10);

        return DonationTransactionResource::collection($transactions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDonationTransactionRequest $request)
    {
        try {
            // Check if user is authorized to create a transaction
            $this->authorize('create', DonationTransaction::class);
            
            return DB::transaction(function () use ($request) {
                $event = DonationEvent::findOrFail($request->event_id);
                $user = $request->user();
                
                // Get the transaction type from the request (set in the validation)
                $transactionType = $request->getTransactionType();
                
                // Create the transaction with pending status
                // The observer will handle setting the status to pending
                $transaction = new DonationTransaction([
                    'user_id' => $user->id,
                    'event_id' => $event->id,
                    'transaction_type' => $transactionType,
                    'amount' => $request->amount,
                    'status' => 'pending',
                    'transaction_at' => now(),
                ]);

                // Save the transaction
                $transaction->save();

                // Return the created transaction with related data
                return new DonationTransactionResource($transaction->load('user', 'event'));
            });
        }
        catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            Log::error('Transaction failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Transaction failed',
                'error' => $e->getMessage()
            ], 403);
        } 
        catch (\Exception $e) {
            Log::error('Transaction failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Transaction failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $transaction = DonationTransaction::with(['user', 'event'])->findOrFail($id);
        
        // Check if the user is authorized to view this transaction
        $this->authorize('view', $transaction);
        
        return new DonationTransactionResource($transaction);
    }

    /**
     * Update the status of a transaction
     *
     * @param UpdateTransactionStatusRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(UpdateTransactionStatusRequest $request, string $id)
    {
        $transaction = DonationTransaction::findOrFail($id);
        
        // Check if user is authorized to update the transaction status
        $this->authorize('update', $transaction);
        
        // Update the transaction status
        $transaction->status = $request->status;
        
        $transaction->save();
        
        return response()->json([
            'message' => 'Transaction status updated successfully',
            'data' => new DonationTransactionResource($transaction->load('user', 'event'))
        ]);
    }
}
