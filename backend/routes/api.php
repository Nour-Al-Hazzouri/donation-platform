<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\LocationController;
use App\Http\Controllers\API\AnnouncementController;
use App\Http\Controllers\API\StatisticsController;
use App\Http\Controllers\API\VerificationController;
use App\Http\Controllers\API\CommunityPostController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\DonationEventController;
use App\Http\Controllers\API\DonationTransactionController;
use App\Http\Controllers\API\VoteController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get("/up", function () {
    return response()->json([
        'message' => 'Application is up and running',
    ], 200);
});

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Password reset routes
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// public routes for unauthenticated users
Route::apiResource('announcements', AnnouncementController::class)->only(['index', 'show']);
Route::apiResource('locations', LocationController::class)->only(['index', 'show']);
Route::apiResource('community-posts', CommunityPostController::class)->only(['index', 'show']);
Route::get('community-posts/{communityPost}/comments', [CommentController::class, 'index']);
Route::get('donation-events/requests', [DonationEventController::class, 'requestsIndex']);
Route::get('donation-events/offers', [DonationEventController::class, 'offersIndex']);
Route::get('donation-events/user/{user}', [DonationEventController::class, 'userIndex']);
Route::apiResource('donation-events', DonationEventController::class)->only(['index', 'show']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Current user
    Route::get('/me', function (Request $request) {
        return new UserResource($request->user());
    });

    // Users resource (protected by auth and permissions)
    Route::apiResource('users', UserController::class)
        ->except('promoteToModerator')
        ->middleware(['permission:manage users']);

    // User profile (no special permissions needed for own profile)
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'profile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
    });

    // Verification routes
    Route::prefix('verifications')->group(function () {
        // Admin only routes
        Route::middleware(['role:admin'])->group(function () {
            // List all verification requests
            Route::get('/', [VerificationController::class, 'index']);

            // Get verifications for a specific user
            Route::get('/user/{user}', [VerificationController::class, 'userVerifications']);

            // Update verification status
            Route::put('/{verification}/{status}', [VerificationController::class, 'updateStatus']);
        });

        // Public verification request submission
        Route::post('/', [VerificationController::class, 'store']);

        // View own verification requests
        Route::get('/my-verifications', function (Request $request) {
            return app(VerificationController::class)->userVerifications($request, auth()->user());
        });

        // View specific verification request (users can view their own, admins can view any)
        Route::get('/{verification}', [VerificationController::class, 'show']);

        // Delete verification request (users can delete their own pending requests, admins can delete any)
        Route::delete('/{verification}', [VerificationController::class, 'destroy']);
    });

    // Admin only routes
    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('locations', LocationController::class)->except(['index', 'show']);
        Route::get('statistics', [StatisticsController::class, 'index']);
        Route::post('users/{user}/promote-to-moderator', [UserController::class, 'promoteToModerator']);
        Route::apiResource('announcements', AnnouncementController::class)->except(['index', 'show']);
    });

    // Community Posts
    Route::apiResource('community-posts', CommunityPostController::class)->except('index', 'show');

    // Votes for community posts
    Route::prefix('community-posts/{postId}')->group(function () {
        Route::post('/vote', [VoteController::class, 'vote']);
        Route::get('/my-vote', [VoteController::class, 'getUserVote']);
    });

    // Comments for community posts
    Route::prefix('community-posts/{communityPost}/comments')->group(function () {
        Route::post('/', [CommentController::class, 'store']);
        Route::put('/{comment}', [CommentController::class, 'update']);
        Route::delete('/{comment}', [CommentController::class, 'destroy']);
    });

    // Donation events (public for all authenticated users to view, but only admins/moderators can create/update/delete)
    Route::prefix('donation-events')->group(function () {
        Route::post('/', [DonationEventController::class, 'store']);
        Route::put('/{donationEvent}', [DonationEventController::class, 'update']);
        Route::delete('/{donationEvent}', [DonationEventController::class, 'destroy']);

        // Transactions for a specific donation event
        Route::get('/{donationEvent}/transactions', [DonationTransactionController::class, 'index']);
        Route::post('/{donationEvent}/transactions', [DonationTransactionController::class, 'store']);

        // Status management routes for donation events
        Route::post('/{donationEvent}/activate', [DonationEventController::class, 'activate']);
        Route::post('/{donationEvent}/cancel', [DonationEventController::class, 'cancel']);
        Route::post('/{donationEvent}/suspend', [DonationEventController::class, 'suspend']);
    });

    // General donation transactions routes
    Route::prefix('donation-transactions')->group(function () {
        Route::get('/', [DonationTransactionController::class, 'index']);
        Route::get('/{transaction}', [DonationTransactionController::class, 'show']);
        Route::put('/{transaction}/status', [DonationTransactionController::class, 'updateStatus']);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        // List notifications with optional filters
        Route::get('/', [NotificationController::class, 'index']);

        // Get notification types
        Route::get('/types', [NotificationController::class, 'types']);

        // Get unread count
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);

        // Mark notification as read
        Route::put('/{notification}/read', [NotificationController::class, 'markAsRead']);

        // Mark all notifications as read
        Route::put('/mark-all-read', [NotificationController::class, 'markAllAsRead']);

        // Delete all unread notifications for the authenticated user
        Route::delete('/unread', [NotificationController::class, 'destroyUnread']);

        // Delete all read notifications for the authenticated user
        Route::delete('/read', [NotificationController::class, 'destroyRead']);

        // Delete a specific notification
        Route::delete('/{notification}', [NotificationController::class, 'destroy']);

        // Delete all notifications for the authenticated user
        Route::delete('/', [NotificationController::class, 'destroyAll']);
    });
});


