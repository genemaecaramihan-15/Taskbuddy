<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'first_name' => ['required_without:name', 'nullable', 'string', 'max:80'],
            'middle_name' => ['required_without:name', 'string', 'max:80'],
            'last_name' => ['required_without:name', 'nullable', 'string', 'max:80'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => $this->emailRules(),
            'phone_number' => ['nullable', 'string', 'regex:/^\\+[1-9]\\d{7,14}$/'],
            'password' => $this->passwordRules(),
        ])->validate();

        $nameParts = preg_split('/\s+/u', trim($input['name'] ?? '')) ?: [];
        $firstName = $input['first_name'] ?? array_shift($nameParts) ?? '';
        $lastName = $input['last_name'] ?? (count($nameParts) > 0 ? array_pop($nameParts) : '');
        $middleName = $input['middle_name'] ?? (implode(' ', $nameParts) ?: null);
        $name = trim(implode(' ', array_filter(
            [$firstName, $middleName, $lastName],
            fn (?string $part): bool => filled($part),
        )));

        return User::create([
            'name' => $name,
            'first_name' => $firstName,
            'middle_name' => $middleName,
            'last_name' => $lastName,
            'email' => $input['email'],
            'phone_number' => $input['phone_number'] ?? null,
            'password' => $input['password'],
        ]);
    }
}
