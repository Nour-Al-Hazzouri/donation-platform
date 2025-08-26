<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\ImageService;

class UserController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    private $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $this->authorize('view users');

        $request->validate([
            'query' => 'sometimes|string|max:255',
            'per_page' => 'sometimes|integer|min:1|max:100',
        ]);

        $searchTerm = $request->query('query');
        $perPage = $request->query('per_page', 15);
        $users = User::with('location')
            ->when($searchTerm, function ($query) use ($searchTerm) {
                $query->where('username', 'like', '%' . $searchTerm . '%')
                    ->orWhere('email', 'like', '%' . $searchTerm . '%')
                    ->orWhere('phone', 'like', '%' . $searchTerm . '%')
                    ->orWhere('first_name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('last_name', 'like', '%' . $searchTerm . '%');
            })
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
            'message' => 'Users retrieved successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreUserRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreUserRequest $request)
    {
        $this->authorize('create users');

        $validated = $request->validated();
        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'data' => new UserResource($user),
            'message' => 'User created successfully',
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(User $user)
    {
        $this->authorize('view users');
        $user->load('location');

        return response()->json([
            'data' => new UserResource($user),
            'message' => 'User retrieved successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateUserRequest  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('edit users', $user);

        $validated = $request->validated();

        if ($request->hasFile('avatar_url')) {
            \Log::info('avatar_url', $request->file('avatar_url'));
            // Delete old avatar if it exists
            if ($user->avatar_url) {
                $this->imageService->deleteImage($user->avatar_url);
            }

            // Upload new avatar
            $avatarPath = $this->imageService->uploadImage(
                $request->file('avatar_url'),
                'avatars',
                true, // isPublic
                500,  // maxWidth
                90    // quality
            );

            $validated['avatar_url'] = $avatarPath;
        }

        if ($request->has('delete_avatar') && $request->delete_avatar) {
            // Delete old avatar if it exists
            if ($user->avatar_url) {
                $this->imageService->deleteImage($user->avatar_url);
            }
            $validated['avatar_url'] = null;
        }

        $user->update($validated);
        $user->refresh();

        return response()->json([
            'data' => new UserResource($user),
            'message' => 'User updated successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete users', $user);

        // Delete user avatar if it exists
        if ($user->avatar_url) {
            $this->imageService->deleteImage($user->avatar_url);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ], Response::HTTP_NO_CONTENT);
    }

    /**
     * Get the authenticated user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($request->user()->load('location')),
            'message' => 'User profile retrieved successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Update the authenticated user's profile.
     *
     * @param  \App\Http\Requests\UpdateUserRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(UpdateUserRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if ($request->hasFile('avatar_url')) {
            \Log::info('Processing avatar upload for user: ' . $user->id);
            
            // Delete old avatar if it exists
            if ($user->avatar_url) {
                \Log::info('Deleting old avatar: ' . $user->avatar_url);
                $this->imageService->deleteImage($user->avatar_url);
            }

            // Upload new avatar
            $avatarPath = $this->imageService->uploadImage(
                $request->file('avatar_url'),
                'avatars',
                true, // isPublic
                400,  // maxWidth - reduced for better performance
                85    // quality - slightly reduced for better compression
            );

            \Log::info('New avatar uploaded to: ' . $avatarPath);
            $validated['avatar_url'] = $avatarPath;
        }

        // Handle avatar deletion
        if ($request->has('delete_avatar') && $request->delete_avatar) {
            // Delete old avatar if it exists
            if ($user->avatar_url) {
                $this->imageService->deleteImage($user->avatar_url);
            }
            $validated['avatar_url'] = null;
        }

        $user->update($validated);
        $user->refresh();

        return response()->json([
            'data' => new UserResource($user->load('location')),
            'message' => 'User profile updated successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Promote a user to moderator role.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function promoteToModerator(User $user): JsonResponse
    {
        $this->authorize('promote users');

        // Check if user already has moderator role
        if ($user->hasRole('moderator')) {
            return response()->json([
                'message' => 'User is already a moderator',
            ], Response::HTTP_CONFLICT);
        }

        // Assign moderator role
        $user->assignRole('moderator');

        return response()->json([
            'data' => new UserResource($user->load('roles')),
            'message' => 'User promoted to moderator successfully',
        ], Response::HTTP_OK);
    }
}
