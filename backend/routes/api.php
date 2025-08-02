<?php

use App\Http\Controllers\LocationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // Admin-only endpoints
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('locations', LocationController::class)->except(['index', 'show']);
    });

    // Public endpoints (for authenticated users)
    Route::get('locations', [LocationController::class, 'index']);
    Route::get('locations/{location}', [LocationController::class, 'show']);
});
