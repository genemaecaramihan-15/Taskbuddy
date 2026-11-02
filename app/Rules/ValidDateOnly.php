<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Carbon;

class ValidDateOnly implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $value, $matches)) {
            $fail('Please select a valid date in YYYY-MM-DD format.');

            return;
        }

        [, $year, $month, $day] = $matches;

        if (! checkdate((int) $month, (int) $day, (int) $year)) {
            $fail('That date does not exist. Please select a valid date.');

            return;
        }

        if ($value < Carbon::today(config('app.timezone'))->toDateString()) {
            $fail('Due date cannot be in the past. Please choose today or a future date.');
        }
    }
}
