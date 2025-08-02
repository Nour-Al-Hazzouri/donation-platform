<?php

namespace App\Http\Controllers\API;

use App\Models\Location;
use App\Http\Resources\LocationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        try {
            $locations = Location::all();
            return response()->json([
                'data' => LocationResource::collection($locations),
                'message' => 'Locations retrieved successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching locations: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve locations',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'governorate' => 'required|string|max:255',
                'district' => 'required|string|max:255',
            ]);

            $location = Location::create($validated);

            return response()->json([
                'data' => new LocationResource($location),
                'message' => 'Location created successfully',
            ], Response::HTTP_CREATED);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        } catch (\Exception $e) {
            Log::error('Error creating location: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create location',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param Location $location
     * @return JsonResponse
     */
    public function show(Location $location)
    {
        try {
            return response()->json([
                'data' => new LocationResource($location),
                'message' => 'Location retrieved successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching location ' . $location->id . ': ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve location',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Location $location
     * @return JsonResponse
     */
    public function update(Request $request, Location $location)
    {
        try {
            $validated = $request->validate([
                'governorate' => 'required|string|max:255',
                'district' => 'required|string|max:255',
            ]);

            $location->update($validated);

            return response()->json([
                'data' => new LocationResource($location->fresh()),
                'message' => 'Location updated successfully',
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        } catch (\Exception $e) {
            Log::error('Error updating location ' . $location->id . ': ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update location',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Location $location
     * @return JsonResponse
     */
    public function destroy(Location $location)
    {
        try {
            $location->delete();

            return response()->json([
                'message' => 'Location deleted successfully',
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            Log::error('Error deleting location ' . $location->id . ': ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete location',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
