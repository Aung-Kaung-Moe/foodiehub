<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

    $data = $request->validate([
        'name'         => ['nullable','string','max:255'],
        'username'     => ['nullable','string','max:255', Rule::unique('users','username')->ignore($user->id)],
        'email'        => ['nullable','email','max:255', Rule::unique('users','email')->ignore($user->id)],
        'home_address' => ['nullable','string','max:255'],
        'street'       => ['nullable','string','max:255'],
        'city'         => ['nullable','string','max:255'],
        'region'       => ['nullable','string','max:255'],
        'country'      => ['nullable','string','max:255'],
    ]);

    // normalize empty strings -> null
    foreach ($data as $k => $v) {
        if (is_string($v) && trim($v) === '') $data[$k] = null;
    }

    $user->fill($data)->save();

    return response()->json(['ok' => true, 'user' => $user]);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required','file','image','max:2048'], // 2MB
        ]);

        $user = $request->user();

        // Delete old avatar if it was stored on the local "public" disk
        if ($user->avatar_url && Str::startsWith($user->avatar_url, '/storage/')) {
            $oldPath = Str::replaceFirst('/storage/', '', $user->avatar_url); // avatars/xxx.png
            Storage::disk('public')->delete($oldPath);
        }

        // Store on "public" disk under avatars/
        // results in path like: avatars/uuid.png
        $path = $request->file('avatar')->store('avatars', 'public');
        $url  = Storage::url($path); // -> /storage/avatars/uuid.png

        $user->avatar_url = $url;
        $user->save();

        return response()->json(['ok' => true, 'avatar_url' => $url, 'user' => $user]);
    }

    public function updatePassword(Request $request)
{
    $user = $request->user();

    // Basic presence checks (no "confirmed" yet — we want custom order/messages)
    $request->validate([
        'current_password' => ['required','string'],
        'new_password' => ['required','string','min:8','max:128'],
        'new_password_confirmation' => ['required','string','min:8','max:128'],
    ]);

    // 1) Check current password first
    if (!\Illuminate\Support\Facades\Hash::check($request->input('current_password'), $user->password)) {
        return response()->json(['message' => 'Current password is incorrect'], 422);
    }

    // 2) Then make sure new passwords match
    if ($request->input('new_password') !== $request->input('new_password_confirmation')) {
        return response()->json(['message' => 'New passwords do not match'], 422);
    }

    // Optional: prevent re-using the same password
    if (\Illuminate\Support\Facades\Hash::check($request->input('new_password'), $user->password)) {
        return response()->json(['message' => 'New password must be different from current password'], 422);
    }

    // 3) Update
    $user->password = \Illuminate\Support\Facades\Hash::make($request->input('new_password'));
    $user->save();

    return response()->json(['ok' => true]);
}

}
