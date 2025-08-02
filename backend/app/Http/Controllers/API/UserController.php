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


class UserController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $this->authorize('view users');
        $users = User::with('location')->paginate(15);

        return response()->json([
            'data' => UserResource::collection($users),
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

        $user->update($request->validated());

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
        $user->update($request->validated());

        return response()->json([
            'data' => new UserResource($user->load('location')),
            'message' => 'User profile updated successfully',
        ], Response::HTTP_OK);
    }
}
