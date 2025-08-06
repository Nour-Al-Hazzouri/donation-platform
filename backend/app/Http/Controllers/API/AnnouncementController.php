<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AnnouncementController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    /**
     * Display a listing of the announcements.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $announcements = Announcement::with('user')->latest()->paginate(10);

        return response()->json([
            'data' => AnnouncementResource::collection($announcements),
            'message' => 'Announcements retrieved successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created announcement in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Announcement::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'priority' => 'sometimes|string|in:' . implode(',', Announcement::getPriorities()),
            'images' => 'sometimes|array',
            'images.*' => 'url'
        ]);

        // Set default priority if not provided
        $validated['priority'] = $validated['priority'] ?? Announcement::PRIORITY_MEDIUM;

        $announcement = Auth::user()->announcements()->create($validated);

        return response()->json([
            'data' => new AnnouncementResource($announcement->load('user')),
            'message' => 'Announcement created successfully',
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified announcement.
     *
     * @param  \App\Models\Announcement  $announcement
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Announcement $announcement): JsonResponse
    {
        return response()->json([
            'data' => new AnnouncementResource($announcement->load('user')),
            'message' => 'Announcement retrieved successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified announcement in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Announcement  $announcement
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Announcement $announcement): JsonResponse
    {
        $this->authorize('update', $announcement);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'priority' => 'sometimes|string|in:' . implode(',', Announcement::getPriorities()),
            'images' => 'sometimes|array',
            'images.*' => 'url'
        ]);

        $announcement->update($validated);

        return response()->json([
            'data' => new AnnouncementResource($announcement->load('user')),
            'message' => 'Announcement updated successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified announcement from storage.
     *
     * @param  \App\Models\Announcement  $announcement
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Announcement $announcement): JsonResponse
    {
        $this->authorize('delete', $announcement);

        $announcement->delete();

        return response()->json([
            'message' => 'Announcement deleted successfully',
        ], Response::HTTP_OK);
    }
}
