<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class GmailAddress implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $domain = strtolower((string) substr(strrchr((string) $value, '@') ?: '', 1));

        if (! in_array($domain, ['gmail.com', 'googlemail.com'], true)) {
            $fail('Please use a Gmail address so we can email your task reminders.');
        }
    }
}
