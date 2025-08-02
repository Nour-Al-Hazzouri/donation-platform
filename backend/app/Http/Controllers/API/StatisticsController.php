<?php

namespace App\Http\Controllers\API;

use App\Models\DonationEvent;
use App\Models\DonationTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'total_transactions' => DonationTransaction::count(),
            'total_amount_donated' => DonationTransaction::sum('amount'),
            'active_donation_events' => DonationEvent::where('status', 'active')->count(),
            'recent_transactions' => DonationTransaction::with('user', 'donationEvent')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'amount' => $transaction->amount,
                        'user' => $transaction->user->name,
                        'event' => $transaction->donationEvent->title,
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
