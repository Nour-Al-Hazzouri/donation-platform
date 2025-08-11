<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreDonationEventRequest;
use App\Http\Requests\UpdateDonationEventRequest;
use App\Models\DonationEvent;
use App\Http\Resources\DonationEventResource;
use App\Services\ImageService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class DonationEventController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    /**
     * @var ImageService
     */
    protected $imageService;

    /**
     * @param ImageService $imageService
     */
    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }
    /**
     * Display a listing of Donation Events.
     */
    public function index()
    {
        $donationEvents = DonationEvent::with('user', 'location')->latest()->get();
        return response()->json([
            'data' => DonationEventResource::collection($donationEvents),
            'message' => 'Donation events retrieved successfully.',
        ], 200);
    }

    /* store donation */
    public function store(StoreDonationEventRequest $request)
    {
        $this->authorize('create', DonationEvent::class);

        $validated = $request->validated();
        $validated['current_amount'] = 0;
        $validated['possible_amount'] = 0;
        $validated['user_id'] = auth()->user()->id;
        $validated['status'] = 'active';

        try {
            // Handle file uploads if any
            $imagePaths = [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $this->imageService->uploadImage($image, 'donation_events');
                    if ($path) {
                        $imagePaths[] = $path;
                    }
                }
            }

            // Add any existing image URLs
            if (!empty($validated['image_urls'])) {
                $imagePaths = array_merge($imagePaths, (array)$validated['image_urls']);
            }

            // Create the donation event with the image paths
            $donationEvent = DonationEvent::create(array_merge($validated, [
                'image_urls' => $imagePaths,
            ]));

            return response()->json([
                'data' => new DonationEventResource($donationEvent->load('user', 'location')),
                'message' => 'Donation event created successfully.',
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            Log::error('Error creating donation event: ' . $e->getMessage());

            // Clean up any uploaded files if there was an error
            if (!empty($imagePaths)) {
                foreach ($imagePaths as $path) {
                    $this->imageService->deleteImage($path);
                }
            }

            return response()->json([
                'message' => 'Failed to create donation event',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified Donation Event.
     */
    public function show(DonationEvent $donationEvent)
    {
        $this->authorize('view', $donationEvent);
        $donationEvent = DonationEvent::with('user', 'location')->findOrFail($donationEvent->id);
        return response()->json([
            'data' => new DonationEventResource($donationEvent),
            'message' => 'Donation event retrieved successfully.',
        ], 200);
    }

    /* update donation */
    public function update(UpdateDonationEventRequest $request, DonationEvent $donationEvent)
    {
        $this->authorize('update', $donationEvent);

        $validated = $request->validated();
        $uploadedImagePaths = [];

        try {
            $imagePaths = $donationEvent->image_urls ?? [];

            // Handle new file uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $this->imageService->uploadImage($image, 'donation_events');
                    if ($path) {
                        $uploadedImagePaths[] = $path;
                    }
                }
                $imagePaths = array_merge($imagePaths, $uploadedImagePaths);
            }

            // Add any new image URLs
            if (isset($validated['image_urls'])) {
                $imagePaths = array_merge($imagePaths, (array)$validated['image_urls']);
            }

            // Remove images that need to be deleted
            if (!empty($validated['remove_image_urls'])) {
                foreach ($validated['remove_image_urls'] as $imageToRemove) {
                    // Only delete the image if it exists in the current image paths
                    if (($key = array_search($imageToRemove, $imagePaths)) !== false) {
                        unset($imagePaths[$key]);
                        // Delete the actual file from storage
                        $this->imageService->deleteImage($imageToRemove);
                    }
                }
                // Re-index the array to avoid JSON encoding issues
                $imagePaths = array_values($imagePaths);
            }

            // Update the donation event with the new data and image paths
            $donationEvent->update(array_merge($validated, [
                'image_urls' => $imagePaths,
            ]));

            return response()->json([
                'data' => new DonationEventResource($donationEvent->load('user', 'location')),
                'message' => 'Donation event updated successfully.',
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            Log::error('Error updating donation event: ' . $e->getMessage());

            // Clean up any newly uploaded files if there was an error
            if (!empty($uploadedImagePaths)) {
                foreach ($uploadedImagePaths as $path) {
                    $this->imageService->deleteImage($path);
                }
            }

            return response()->json([
                'message' => 'Failed to update donation event',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Remove the specified donation event.
     */
    public function destroy(DonationEvent $donationEvent)
    {
        $this->authorize('delete', $donationEvent);

        try {
            // Delete all associated images
            if (!empty($donationEvent->image_urls)) {
                foreach ($donationEvent->image_urls as $imagePath) {
                    if (!$this->imageService->deleteImage($imagePath)) {
                        Log::warning('Failed to delete image during donation event deletion: ' . $imagePath);
                    }
                }
            }

            // Delete the donation event
            $donationEvent->delete();

            return response()->json([
                'success' => true,
                'message' => 'Donation event deleted successfully.',
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            Log::error('Error deleting donation event: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete donation event',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
