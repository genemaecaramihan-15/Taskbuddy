<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Notifications\TaskDeadlineReminder;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SendOverdueTaskReminders extends Command
{
    protected $signature = 'tasks:send-overdue-reminders';

    protected $description = 'Send reminders for tasks due tomorrow and unfinished overdue tasks';

    public function handle(): int
    {
        $today = Carbon::today();
        $tomorrow = $today->copy()->addDay();
        $count = 0;

        Task::query()
            ->with('user')
            ->whereNotNull('user_id')
            ->whereHas('user', fn ($user) => $user->whereNotNull('email_verified_at'))
            ->whereNotNull('due_date')
            ->where('status', '!=', 'completed')
            ->where(function ($query) use ($today, $tomorrow): void {
                $query
                    ->where(function ($dueTomorrow) use ($tomorrow): void {
                        $dueTomorrow->whereDate('due_date', $tomorrow)
                            ->whereNull('due_tomorrow_notified_at');
                    })
                    ->orWhere(function ($overdue) use ($today): void {
                        $overdue->whereDate('due_date', '<', $today)
                            ->whereNull('overdue_notified_at');
                    });
            })
            ->chunkById(100, function ($tasks) use (&$count, $today, $tomorrow): void {
                foreach ($tasks as $task) {
                    $type = $task->due_date->isSameDay($tomorrow) ? 'due_tomorrow' : 'overdue';
                    $task->user->notify(new TaskDeadlineReminder($task, $type));

                    $task->forceFill([
                        $type === 'due_tomorrow' ? 'due_tomorrow_notified_at' : 'overdue_notified_at' => $today,
                    ])->save();

                    $count++;
                }
            });

        $this->info("Sent {$count} task deadline reminder notification(s).");

        return self::SUCCESS;
    }
}
