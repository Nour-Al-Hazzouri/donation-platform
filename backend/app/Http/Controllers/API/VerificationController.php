<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Verification;
use App\Models\User;
use App\Services\ImageService;
use App\Services\NotificationService;
use App\Http\Resources\VerificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VerificationController extends Controller
{
    /**
     * @var NotificationService
     */
    private NotificationService $notificationService;

    /**
     * @var ImageService
     */
    private ImageService $imageService;

    /**
     * Summary of __construct
     * @param \App\Services\NotificationService $notificationService
     * @param \App\Services\ImageService $imageService
     */
    public function __construct(NotificationService $notificationService, ImageService $imageService)
    {
        $this->notificationService = $notificationService;
        $this->imageService = $imageService;
    }

    /**
     * Display a listing of all verification requests.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Only admins can view all verification requests
            if (!Auth::user()->hasRole('admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.',
                ], Response::HTTP_FORBIDDEN);
            }

            $request->validate([
                'per_page' => 'sometimes|integer|min:1|max:100',
                'status' => 'sometimes|string|in:pending,approved,rejected',
                'query' => 'sometimes|string|max:255',
            ]);
            $perPage = $request->query('per_page', 15);
            $searchTerm = $request->query('query');

            $verifications = Verification::with(['user'])
                ->when($request->has('status'), function ($query) use ($request) {
                    $query->where('status', $request->status);
                })
                ->when($request->has('query'), function ($query) use ($searchTerm) {
                    $query->whereHas('user', function ($query) use ($searchTerm) {
                        $query->where('username', 'like', '%' . $searchTerm . '%')
                            ->orWhere('email', 'like', '%' . $searchTerm . '%')
                            ->orWhere('phone', 'like', '%' . $searchTerm . '%')
                            ->orWhere('first_name', 'like', '%' . $searchTerm . '%')
                            ->orWhere('last_name', 'like', '%' . $searchTerm . '%');
                    });
                })
                ->latest()
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Verification requests retrieved successfully.',
                'data' => VerificationResource::collection($verifications),
                'meta' => [
                    'current_page' => $verifications->currentPage(),
                    'last_page' => $verifications->lastPage(),
                    'per_page' => $verifications->perPage(),
                    'total' => $verifications->total(),
                ],
            ], Response::HTTP_OK);

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
                'data' => new VerificationResource($verification),
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
    public function userVerifications(Request $request, User $user): JsonResponse
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

            $request->validate([
                'per_page' => 'sometimes|integer|min:1|max:100',
            ]);
            $perPage = $request->query('per_page', 15);
            $verifications = Verification::where('user_id', $user->id)
                ->with(['user'])
                ->latest()
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'User verification requests retrieved successfully.',
                'data' => VerificationResource::collection($verifications),
                'meta' => [
                    'total' => $verifications->total(),
                    'per_page' => $verifications->perPage(),
                    'current_page' => $verifications->currentPage(),
                    'last_page' => $verifications->lastPage(),
                ],
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

    public function store(Request $request): JsonResponse
    {
        try {
            // Ensure the user is authenticated
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Please log in to submit a verification request.',
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Check if user already has a pending verification
            $existingVerification = Verification::where('user_id', $user->id)
                ->where('status', 'pending')
                ->first();

            if ($existingVerification) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have a pending verification request.',
                ], Response::HTTP_CONFLICT);
            }

            // Validate the request inputs
            $validated = $request->validate([
                'document_type' => 'required|string|in:id_card,passport,driver_license|max:255',
                'documents' => 'required|array|min:1|max:7',
                'documents.*' => 'required|file|mimes:jpeg,png,jpg,pdf|max:10240', // 10MB max per file
            ], [
                'documents.required' => 'At least one document is required',
                'documents.*.mimes' => 'Each document must be a file of type: jpeg, png, jpg, pdf',
                'documents.*.max' => 'Each document must not be larger than 10MB',
            ]);

            // Process and store the uploaded documents
            $documentPaths = [];

            foreach ($request->file('documents') as $file) {
                if ($file->isValid()) {
                    $path = $this->imageService->uploadImage(
                        $file,
                        'verifications/' . $user->id,
                        false, // Store as private
                        2000,  // Max width for images
                        90     // Quality
                    );

                    if ($path) {
                        $documentPaths[] = $path;
                    }
                }
            }

            if (empty($documentPaths)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload documents. Please try again.',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // Create the verification record
            $verification = $user->verifications()->create([
                'document_type' => $validated['document_type'],
                'image_urls' => $documentPaths,
                'status' => 'pending',
            ]);

            // Load relationships for the response
            $verification->load(['user']);

            $this->notificationService->sendVerificationRequestSent(
                $user,
                [
                    'user_id' => $user->id,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Verification request submitted successfully.',
                'data' => new VerificationResource($verification),
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

            // Start a database transaction
            \DB::beginTransaction();

            try {
                $verification->update([
                    'status' => $status,
                    'notes' => $validated['notes'] ?? null,
                    'verified_at' => now(),
                    'verifier_id' => auth()->id(),
                ]);

                if ($status === 'approved') {
                    $verification->user->update([
                        'is_verified' => true,
                        'email_verified_at' => now(),
                    ]);
                } else if ($status === 'rejected') {
                    // If rejected, delete the uploaded documents
                    $verification->user->update([
                        'is_verified' => false,
                        'email_verified_at' => null,
                    ]);
                    $verification->deleteImages();
                }

                \DB::commit();

                // Reload the verification with relationships
                $verification->load(['user']);

                if ($status === 'approved') {
                    $this->notificationService->sendVerificationStatus(
                        $verification->user,
                        true,
                        $validated['notes'] ?? null,
                        [
                            'user_id' => Auth::user()->id,
                            'verification_id' => $verification->id,
                        ]
                    );
                } else if ($status === 'rejected') {
                    $this->notificationService->sendVerificationStatus(
                        $verification->user,
                        false,
                        $validated['notes'] ?? null,
                        [
                            'user_id' => Auth::user()->id,
                            'verification_id' => $verification->id,
                        ]
                    );
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Verification status updated successfully.',
                    'data' => new VerificationResource($verification),
                ], Response::HTTP_OK);

            } catch (\Exception $e) {
                \DB::rollBack();
                throw $e;
            }

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

    /**
     * Remove the specified verification request.
     *
     * @param  \App\Models\Verification  $verification
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Verification $verification): JsonResponse
    {
        try {
            $user = Auth::user();

            // Only allow admin or the owner to delete
            if (!$user->hasRole('admin') && $verification->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only delete your own verification requests.',
                ], Response::HTTP_FORBIDDEN);
            }

            // Only allow deletion if status is pending
            if ($verification->status !== 'pending' && !$user->hasRole('admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending verification requests can be deleted.',
                ], Response::HTTP_BAD_REQUEST);
            }

            // Delete associated documents
            $verification->deleteImages();

            // Delete the verification record
            $verification->delete();

            return response()->json([
                'success' => true,
                'message' => 'Verification request deleted successfully.',
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting verification request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete verification request.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
