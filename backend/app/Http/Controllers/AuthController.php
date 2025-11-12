<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Normalize inputs before validating
        $username = trim((string) $request->input('username', ''));
        $rawEmail = $request->input('email', null);
        $email = is_string($rawEmail) ? trim($rawEmail) : $rawEmail;
        if ($email === '') { $email = null; }

        $request->merge([
            'username' => $username,
            'email'    => $email,
        ]);

        $data = $request->validate([
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')],
            'email'    => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8', 'max:128'],
        ]);

        try {
            $user = User::create([
                'name'     => $data['username'], // seed name with username (optional)
                'username' => $data['username'],
                'email'    => $data['email'] ?? null,
                'password' => Hash::make($data['password']),
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Could not create user',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 422);
        }

        return response()->json([
            'ok'   => true,
            'user' => $this->publicUser($user),
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'identifier' => ['required', 'string'],
            'password'   => ['required', 'string'],
        ]);

        $user = User::where('username', $data['identifier'])
            ->orWhere('email', $data['identifier'])
            ->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['user' => $this->publicUser($user)]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['ok' => true]);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $this->publicUser($request->user())]);
    }

    private function publicUser(?User $u)
    {
        if (!$u) return null;

        return [
            'id'           => $u->id,
            'name'         => $u->name,
            'username'     => $u->username,
            'email'        => $u->email,
            'avatar_url'   => $u->avatar_url,
            'home_address' => $u->home_address,
            'street'       => $u->street,
            'city'         => $u->city,
            'region'       => $u->region,
            'country'      => $u->country,
            'created_at'   => $u->created_at,
        ];
    }
}
