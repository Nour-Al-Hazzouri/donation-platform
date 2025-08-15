<?php

namespace App\Http\Controllers\API;

use App\Models\DonationEvent;
use App\Models\DonationTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;

class StatisticsController extends Controller
{
    /**
     * Get platform statistics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_donation_events' => DonationEvent::count(),
            'total_donation_requests' => DonationEvent::where('type', 'request')->count(),
            'total_donation_offers' => DonationEvent::where('type', 'offer')->count(),
            'total_transactions' => DonationTransaction::count(),
            'total_transaction_contributions' => DonationTransaction::where('transaction_type', 'contribution')->count(),
            'total_transaction_claims' => DonationTransaction::where('transaction_type', 'claim')->count(),
            'total_amount_donated' => DonationTransaction::where('transaction_type', 'contribution')->sum('amount'),
            'active_donation_events' => DonationEvent::where('status', 'active')->count(),
            'recent_transactions' => DonationTransaction::with('user', 'event')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'amount' => $transaction->amount,
                        'user' => $transaction->user->first_name . ' ' . $transaction->user->last_name,
                        'event' => $transaction->event->title,
                        'transaction_type' => $transaction->transaction_type,
                        'status' => $transaction->status,
                        'created_at' => $transaction->created_at->toDateTimeString(),
                    ];
                }),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ], Response::HTTP_OK);
    }
}