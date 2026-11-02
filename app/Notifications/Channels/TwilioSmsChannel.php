<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class TwilioSmsChannel
{
    public function send(object $notifiable, Notification $notification): void
    {
        if (blank($notifiable->phone_number)) {
            return;
        }

        $accountSid = config('services.twilio.account_sid');
        $authToken = config('services.twilio.auth_token');
        $from = config('services.twilio.from');

        if (blank($accountSid) || blank($authToken) || blank($from)) {
            throw new RuntimeException('Twilio is not configured for task deadline SMS reminders.');
        }

        Http::asForm()
            ->withBasicAuth($accountSid, $authToken)
            ->post("https://api.twilio.com/2010-04-01/Accounts/{$accountSid}/Messages.json", [
                'To' => $notifiable->phone_number,
                'From' => $from,
                'Body' => $notification->toSms($notifiable),
            ])
            ->throw();
    }
}
