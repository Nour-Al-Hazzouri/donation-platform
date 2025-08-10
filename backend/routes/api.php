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
use App\Http\Controllers\API\VoteController;
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
        // Public verification request submission
        Route::post('/', [VerificationController::class, 'store']);
        
        // View own verification requests
        Route::get('/my-verifications', function () {
            return app(VerificationController::class)->userVerifications(auth()->user());
        });

        // View specific verification request (users can view their own, admins can view any)
        Route::get('/{verification}', [VerificationController::class, 'show']);

        // Admin only routes
        Route::middleware(['role:admin'])->group(function () {
            // List all verification requests
            Route::get('/', [VerificationController::class, 'index']);
            
            // Get verifications for a specific user
            Route::get('/user/{user}', [VerificationController::class, 'userVerifications']);
            
            // Update verification status
            Route::post('/{verification}/{status}', [VerificationController::class, 'updateStatus']);
        });
    });

    // Admin only routes
    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('locations', LocationController::class);
        Route::get('statistics', [StatisticsController::class, 'index']);
        Route::post('users/{user}/promote-to-moderator', [UserController::class, 'promoteToModerator']);
        Route::apiResource('announcements', AnnouncementController::class)->except(['index', 'show']);
    });

    // Announcements (public for all authenticated users to view, but only admins/moderators can create/update/delete)
    Route::apiResource('announcements', AnnouncementController::class)->only(['index', 'show']);

    // Public locations (for all authenticated users)
    Route::get('locations', [LocationController::class, 'index']);
    Route::get('locations/{location}', [LocationController::class, 'show']);

    // Community Posts
    Route::apiResource('community-posts', CommunityPostController::class);
    
    // Votes for community posts
    Route::prefix('community-posts/{postId}')->group(function () {
        Route::post('/vote', [VoteController::class, 'vote']);
        Route::get('/my-vote', [VoteController::class, 'getUserVote']);
    });
    
    // Comments for community posts
    Route::prefix('community-posts/{communityPost}/comments')->group(function () {
        Route::get('/', [CommentController::class, 'index']);
        Route::post('/', [CommentController::class, 'store']);
        Route::put('/{comment}', [CommentController::class, 'update']);
        Route::delete('/{comment}', [CommentController::class, 'destroy']);
    });

    // Donation events (public for all authenticated users to view, but only admins/moderators can create/update/delete)
    Route::prefix('donation-events')->group(function () {
        Route::get('/', [DonationEventController::class, 'index']);
        Route::get('/{donationEvent}', [DonationEventController::class, 'show']);
        Route::post('/', [DonationEventController::class, 'store']);
        Route::put('/{donationEvent}', [DonationEventController::class, 'update']);
        Route::delete('/{donationEvent}', [DonationEventController::class, 'destroy']);
    }); 

});


