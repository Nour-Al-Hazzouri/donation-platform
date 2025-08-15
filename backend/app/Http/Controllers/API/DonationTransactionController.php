<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDonationTransactionRequest;
use App\Http\Requests\UpdateTransactionStatusRequest;
use App\Http\Resources\DonationTransactionResource;
use App\Models\DonationEvent;
use App\Models\DonationTransaction;
use App\Services\NotificationService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DonationTransactionController extends Controller
{
    use AuthorizesRequests;

    /**
     * @var NotificationService
     */
    private $notificationService;
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    /**
     * Display a listing of the resource.
     *
     * @param  \App\Models\DonationEvent|null  $donationEvent
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request, DonationEvent $donationEvent = null)
    {
        $request->validate([
            'per_page' => 'sometimes|integer|min:1|max:100',
            'status' => 'sometimes|string|in:pending,approved,declined',
            'type' => 'sometimes|string|in:contribution,claim',
        ]);
        $perPage = $request->query('per_page', 10);
        $query = DonationTransaction::with(['user', 'event']);

        // If an event is provided, filter transactions for that event
        if (!empty($donationEvent)) {
            $this->authorize('viewAny', [DonationTransaction::class, $donationEvent]);
            $query->where('event_id', $donationEvent->id);
        } else {
            $this->authorize('viewAny', DonationTransaction::class);
            // For the general transactions list, only show user's transactions
            // or transactions for events they own
            $query->where(function ($q) {
                $q->where('user_id', auth()->id())
                    ->orWhereHas('event', function ($query) {
                        $query->where('user_id', auth()->id());
                    });
            });
        }

        $transactions = $query->latest()->paginate($perPage);

        return response()->json([
            'data' => DonationTransactionResource::collection($transactions),
            'message' => 'Donation transactions retrieved successfully.',
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  StoreDonationTransactionRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreDonationTransactionRequest $request, DonationEvent $donationEvent)
    {
        $this->authorize('create', [DonationTransaction::class, $donationEvent]);

        try {
            return DB::transaction(function () use ($request, $donationEvent) {
                $user = $request->user();

                // Get the transaction type from the request (set in validation)
                $transactionType = $request->getTransactionType();

                // Create the transaction with pending status
                $transaction = new DonationTransaction([
                    'user_id' => $user->id,
                    'event_id' => $donationEvent->id,
                    'transaction_type' => $transactionType,
                    'amount' => $request->amount,
                    'status' => 'pending',
                    'transaction_at' => now(),
                ]);

                // Save the transaction
                $transaction->save();

                $donationEvent->load('user');
                if ($transactionType === 'contribution') {
                    $this->notificationService->sendTransactionContribution(
                        $donationEvent->user,
                        $user->username,
                        $request->amount,
                        $donationEvent->title,
                        [
                            'event_id' => $donationEvent->id,
                            'transaction_id' => $transaction->id,
                            'user_id' => $user->id,
                        ]
                    );
                } else if ($transactionType === 'claim') {
                    $this->notificationService->sendTransactionClaim(
                        $donationEvent->user,
                        $user->username,
                        $request->amount,
                        $donationEvent->title,
                        [
                            'event_id' => $donationEvent->id,
                            'transaction_id' => $transaction->id,
                            'user_id' => $user->id,
                        ]
                    );
                }

                return response()->json([
                    'data' => new DonationTransactionResource($transaction->load('user', 'event')),
                    'message' => 'Donation transaction created successfully.',
                ], Response::HTTP_CREATED);
            });
        } catch (\Exception $e) {
            Log::error('Error creating donation transaction: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to create donation transaction',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  DonationTransaction  $transaction
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(DonationTransaction $transaction)
    {
        $this->authorize('view', $transaction);

        return response()->json([
            'data' => new DonationTransactionResource($transaction->load('user', 'event')),
            'message' => 'Donation transaction retrieved successfully.',
        ], Response::HTTP_OK);
    }

    /**
     * Update the status of a transaction.
     *
     * @param  UpdateTransactionStatusRequest  $request
     * @param  DonationTransaction  $transaction
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(UpdateTransactionStatusRequest $request, DonationTransaction $transaction)
    {
        $this->authorize('updateStatus', $transaction);

        try {
            $transaction->status = $request->status;
            $transaction->save();

            if ($transaction->status === 'approved') {
                $this->notificationService->sendTransactionStatus(
                    $transaction->user,
                    $transaction->event->title,
                    true,
                    null,
                    [
                        'event_id' => $transaction->event_id,
                        'transaction_id' => $transaction->id,
                        'user_id' => $transaction->user_id,
                    ]
                );
            } else if ($transaction->status === 'declined') {
                $this->notificationService->sendTransactionStatus(
                    $transaction->user,
                    $transaction->event->title,
                    false,
                    $request->reason,
                    [
                        'event_id' => $transaction->event_id,
                        'transaction_id' => $transaction->id,
                        'user_id' => $transaction->user_id,
                    ]
                );
            }

            return response()->json([
                'data' => new DonationTransactionResource($transaction->load('user', 'event')),
                'message' => 'Transaction status updated successfully.',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error updating transaction status: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to update transaction status',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
