<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Verification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VerificationController extends Controller
{
    /**
     * Display a listing of all verification requests.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            // Only admins can view all verification requests
            if (!Auth::user()->hasRole('admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.',
                ], Response::HTTP_FORBIDDEN);
            }

            $verifications = Verification::with(['user', 'verifier'])
                ->latest()
                ->paginate(15);

            return response()->json([
                'success' => true,
                'message' => 'Verification requests retrieved successfully.',
                'data' => $verifications,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching verification requests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve verification requests.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified verification request.
     *
     * @param  \App\Models\Verification  $verification
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Verification $verification): JsonResponse
    {
        try {
            $user = Auth::user();

            // Allow access if user is admin or the owner of the verification request
            if (!$user->hasRole('admin') && $verification->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only view your own verification requests.',
                ], Response::HTTP_FORBIDDEN);
            }

            $verification->load(['user', 'verifier']);

            return response()->json([
                'success' => true,
                'message' => 'Verification request retrieved successfully.',
                'data' => $verification,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching verification request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve verification request.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get verification requests for a specific user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function userVerifications(User $user): JsonResponse
    {
        try {
            $currentUser = Auth::user();

            // Allow access if current user is admin or the owner of the verifications
            if (!$currentUser->hasRole('admin') && $currentUser->id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only view your own verification requests.',
                ], Response::HTTP_FORBIDDEN);
            }

            $verifications = Verification::where('user_id', $user->id)
                ->with(['user', 'verifier'])
                ->latest()
                ->paginate(15);

            return response()->json([
                'success' => true,
                'message' => 'User verification requests retrieved successfully.',
                'data' => $verifications,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching user verification requests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user verification requests.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created verification request in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Ensure the user is authenticated
            $userId = auth()->id();
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Please log in to submit a verification request.',
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Validate the request inputs
            $validated = $request->validate([
                'document_type' => 'required|string|in:id_card,passport,driver_license|max:255',
                'documents' => 'required|array|min:1|max:7',
                'documents.*' => 'required|string|url',
            ], [
                'documents.required' => 'At least one document is required',
                'documents.*.url' => 'Each document must be a valid URL',
            ]);

            // Create the verification record
            $verification = Verification::create([
                'user_id' => $userId,
                'document_type' => $validated['document_type'],
                'document_urls' => $validated['documents'],
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Verification request submitted successfully.',
                'data' => $verification,
            ], Response::HTTP_CREATED);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        } catch (\Exception $e) {
            Log::error('Error creating verification request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit verification request',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the verification status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Verification  $verification
     * @param  string  $status
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, Verification $verification, string $status): JsonResponse
    {
        try {
            // Authorization check (using Spatie permissions)
            if (!auth()->user()->hasRole('admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admins only.',
                ], Response::HTTP_FORBIDDEN);
            }

            if ($verification->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Verification has already been processed.',
                ], Response::HTTP_BAD_REQUEST);
            }

            if (!in_array($status, ['approved', 'rejected'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid status. Must be "approved" or "rejected".',
                ], Response::HTTP_BAD_REQUEST);
            }

            $validated = $request->validate([
                'notes' => 'nullable|string|max:1000',
            ]);

            $verification->update([
                'status' => $status,
                'notes' => $validated['notes'] ?? null,
                'verified_at' => now(),
                'verifier_id' => auth()->id(),
            ]);
            if ($status === 'approved') {
                $verification->user->update([
                    'is_verified' => true,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Verification status updated successfully.',
                'data' => $verification,
            ], Response::HTTP_OK);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        } catch (\Exception $e) {
            Log::error('Error updating verification status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update verification status',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
