<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => strtolower(trim($request->email)),
            'password' => Hash::make($request->password),
            'role' => 'student',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Registration successful.',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', strtolower(trim($request->email)))->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'The email or password you entered is incorrect.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Sign in successful.',
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->email_verified_at = now();
            $user->save();
        }

        return response()->json([
            'message' => 'Email verified successfully.',
            'user' => $user,
        ]);
    }

    public function resendVerification(Request $request)
    {
        return response()->json([
            'message' => 'Verification link sent to your email address.',
        ]);
    }

    public function updateAcademicProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'university_id' => 'required|string',
            'programme_name' => 'required|string',
            'year_of_study' => 'required|string',
        ]);

        $user->update([
            'university_id' => $request->university_id,
            'college_id' => $request->college_id,
            'department_id' => $request->department_id,
            'programme_name' => $request->programme_name,
            'year_of_study' => $request->year_of_study,
            'reg_number' => $request->reg_number,
            'graduation_year' => $request->graduation_year,
        ]);

        return response()->json([
            'message' => 'Academic profile updated successfully.',
            'user' => $user->fresh(),
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        return response()->json([
            'message' => 'If an account is associated with that email, password reset instructions have been sent.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::where('email', strtolower(trim($request->email)))->first();
        if ($user) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        return response()->json([
            'message' => 'Password has been reset successfully.',
        ]);
    }
}
