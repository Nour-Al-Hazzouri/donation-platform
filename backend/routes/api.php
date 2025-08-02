<?php

use App\Http\Controllers\LocationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Authentication routes
Route::post('/register', [\App\Http\Controllers\API\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\API\AuthController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\API\AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('reset-password', [AuthController::class, 'resetPassword']); // Now expects 'code' instead of 'token'

// User routes
//read all users

Route::get('/users', [\App\Http\Controllers\API\UserController::class, 'index']);
Route::get('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'show']);
Route::post('/users', [\App\Http\Controllers\API\UserController::class, 'store']);
Route::put('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'update']);
Route::delete('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'destroy']);


Route::middleware('auth:sanctum')->group(function () {
    // Admin-only endpoints
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('locations', LocationController::class)->except(['index', 'show']);
    });

    // Public endpoints (for authenticated users)
    Route::get('locations', [LocationController::class, 'index']);
    Route::get('locations/{location}', [LocationController::class, 'show']);
});

