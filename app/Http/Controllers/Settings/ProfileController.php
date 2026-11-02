<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /** Serve the signed-in user's profile photo without requiring a public storage symlink. */
    public function photo(Request $request)
    {
        $path = $request->user()->profile_photo_path;

        abort_unless($path && Storage::disk('public')->exists($path), 404);

        return Storage::disk('public')->response($path, headers: [
            'Cache-Control' => 'private, no-store',
        ]);
    }

    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->safe()->only(['first_name', 'middle_name', 'last_name', 'email']));
        $user->name = trim(implode(' ', array_filter([
            $user->first_name,
            $user->middle_name,
            $user->last_name,
        ], fn (?string $part): bool => filled($part))));
        $emailChanged = $user->isDirty('email');

        if ($request->hasFile('profile_photo')) {
            $oldPhoto = $user->profile_photo_path;
            $user->profile_photo_path = $request->file('profile_photo')->store('profile-photos', 'public');

            if ($oldPhoto) {
                Storage::disk('public')->delete($oldPhoto);
            }
        }

        if ($emailChanged) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($emailChanged) {
            $request->user()->sendEmailVerificationNotification();

            Inertia::flash('toast', ['type' => 'success', 'message' => 'Profile updated. Verify your new email to receive reminders.']);

            return to_route('profile.edit');
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('login');
    }
}
