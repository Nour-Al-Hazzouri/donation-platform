<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'phone' => 'nullable|string|max:15',
            // 'location_id' => 'required|exists:locations,id',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',

        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'phone' => $request->phone,
            // 'location_id' => $request->location_id,
            'email' => $request->email,
            'password' => bcrypt($request->password),
             
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!auth()->attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = auth()->user();
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user,
            'access_token' => $token
            
        ]);
    
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'User logged out successfully']);
    }


    // Forgot Password: Send OTP code
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = \App\Models\User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $code = random_int(100000, 999999);
        \DB::table('password_resets_codes')->updateOrInsert(
            ['email' => $request->email],
            ['code' => $code, 'created_at' => now()]
        );

        // Send code via email (log for local)
        \Log::info('Password reset code for ' . $request->email . ': ' . $code);

        return response()->json(['success' => true, 'message' => 'OTP code sent to email']);
    }

    // Reset Password: Update password using OTP code
    public function resetPassword(Request $request)
    {
        $request->validate([
            'code' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = \DB::table('password_resets_codes')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$record) {
            return response()->json(['success' => false, 'message' => 'Invalid code or email'], 400);
        }

        // Optional: Check code expiration (10 min)
        if (now()->diffInMinutes($record->created_at) > 10) {
            return response()->json(['success' => false, 'message' => 'Code expired'], 400);
        }

        $user = \App\Models\User::where('email', $request->email)->first();
        $user->password = bcrypt($request->password);
        $user->save();

        // Delete code after use
        \DB::table('password_resets_codes')->where('email', $request->email)->delete();

        return response()->json(['success' => true, 'message' => 'Password reset successful']);
    }
}