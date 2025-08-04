<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Verification;

class VerificationController extends Controller
{
    public function store(Request $request)
    {
        // Ensure the user is authenticated
        $userId = auth()->id();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please log in to submit a verification request.',
            ], 401);
        }

        // Validate the request inputs
        $request->validate([
            'document_type' => 'required|string|max:255',
            'documents' => 'required|array|min:1',
            'documents.*' => 'required|string|url',
        ]);

        // Extract URLs
        $urls = $request->documents;

        // Create the verification record
        $verification = Verification::create([
            'user_id' => $userId,
            'document_type' => $request->document_type,
            'document_urls' => $urls, // Stored as JSON in DB
            'status' => 'pending',    // Default status
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Verification request submitted successfully.',
            'data' => $verification,
        ]);
    }

    

}
