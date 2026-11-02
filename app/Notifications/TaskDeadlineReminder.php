<?php

namespace App\Notifications;

use App\Models\Task;
use App\Notifications\Channels\TwilioSmsChannel;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskDeadlineReminder extends Notification
{
    public function __construct(
        private readonly Task $task,
        private readonly string $type,
    ) {}

    /** @return array<int, string|class-string> */
    public function via(object $notifiable): array
    {
        $channels = ['mail'];

        if (filled($notifiable->phone_number)
            && filled(config('services.twilio.account_sid'))
            && filled(config('services.twilio.auth_token'))
            && filled(config('services.twilio.from'))) {
            $channels[] = TwilioSmsChannel::class;
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        $dueDate = $this->task->due_date->format('F j, Y');
        $isDueTomorrow = $this->type === 'due_tomorrow';
        $message = $isDueTomorrow
            ? "Your task \"{$this->task->title}\" is due tomorrow ({$dueDate})."
            : "Your task \"{$this->task->title}\" is overdue. It was due on {$dueDate}.";

        return (new MailMessage)
            ->subject($isDueTomorrow ? 'TaskBuddy reminder: task due tomorrow' : 'TaskBuddy reminder: task overdue')
            ->greeting('Hello '.$notifiable->name.',')
            ->line($message)
            ->line('Open TaskBuddy to review or update your task.');
    }

    public function toSms(object $notifiable): string
    {
        return $this->type === 'due_tomorrow'
            ? "TaskBuddy: \"{$this->task->title}\" is due tomorrow (".$this->task->due_date->format('M j').').'
            : "TaskBuddy: \"{$this->task->title}\" is overdue (due ".$this->task->due_date->format('M j').').';
    }
}
