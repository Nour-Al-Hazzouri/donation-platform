<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * @param  \App\Http\Requests\StoreUserRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(StoreUserRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => new UserResource($user),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], Response::HTTP_CREATED);
    }

    /**
     * Authenticate user and create token.
     *
     * @param  \App\Http\Requests\LoginRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!auth()->attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => [trans('auth.failed')],
            ]);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($user),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], Response::HTTP_OK);

    }
    /**
     * Log the user out (Invalidate the token).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ], Response::HTTP_OK);
    }


    /**
     * Send password reset OTP code.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        // Always return success to prevent email enumeration
        if (!$user) {
            return response()->json([
                'message' => 'If your email exists in our records, you will receive a password reset code.'
            ]);
        }

        $code = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(10);

        DB::table('password_resets_codes')->updateOrInsert(
            ['email' => $request->email],
            [
                'code' => $code,
                'created_at' => now(),
                'expires_at' => $expiresAt,
            ]
        );

        // In production, you would send an email here
        Log::info('Password reset code for ' . $request->email . ': ' . $code);

        return response()->json([
            'message' => 'If your email exists in our records, you will receive a password reset code.'
        ], Response::HTTP_OK);
    }

    /**
     * Reset password with OTP code.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = DB::table('password_resets_codes')
            ->where('email', $validated['email'])
            ->where('code', $validated['code'])
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Invalid or expired reset code.'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Check if code is expired
        if (now()->gt($record->expires_at)) {
            DB::table('password_resets_codes')->where('email', $validated['email'])->delete();

            return response()->json([
                'message' => 'The reset code has expired. Please request a new one.'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Update user's password
        User::where('email', $validated['email'])
            ->update(['password' => Hash::make($validated['password'])]);

        // Delete all reset tokens for this email
        DB::table('password_resets_codes')->where('email', $validated['email'])->delete();

        return response()->json([
            'message' => 'Password has been reset successfully.'
        ], Response::HTTP_OK);
    }
}
