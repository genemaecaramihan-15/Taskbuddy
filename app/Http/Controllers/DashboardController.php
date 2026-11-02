<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the TaskBuddy dashboard with task metrics and categories.
     */
    public function index(Request $request): Response
    {
        $today = Carbon::today();
        $tomorrow = $today->copy()->addDay();
        $tasksQuery = $request->user()->tasks();

        $totalTasks = (clone $tasksQuery)->count();
        $pendingTasks = (clone $tasksQuery)->where('status', 'to_do')->count();
        $inProgressTasks = (clone $tasksQuery)->where('status', 'in_progress')->count();
        $completedTasks = (clone $tasksQuery)->where('status', 'completed')->count();

        $overdueTasks = (clone $tasksQuery)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', $today)
            ->where('status', '!=', 'completed')
            ->count();

        $dueTodayTasks = (clone $tasksQuery)
            ->whereNotNull('due_date')
            ->whereDate('due_date', $today)
            ->where('status', '!=', 'completed')
            ->count();

        $upcomingTasks = (clone $tasksQuery)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '>', $today)
            ->where('status', '!=', 'completed')
            ->count();

        $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 1) : 0;

        $priorityBreakdown = [
            'low' => (clone $tasksQuery)->where('priority', 'low')->count(),
            'medium' => (clone $tasksQuery)->where('priority', 'medium')->count(),
            'high' => (clone $tasksQuery)->where('priority', 'high')->count(),
            'urgent' => (clone $tasksQuery)->where('priority', 'urgent')->count(),
        ];

        $categories = $request->user()->categories()->withCount('tasks')->get();
        $deadlineReminders = $request->user()->tasks()
            ->whereNotNull('due_date')
            ->where('status', '!=', 'completed')
            ->where(function ($query) use ($today, $tomorrow): void {
                $query->whereDate('due_date', '<=', $today)
                    ->orWhereDate('due_date', $tomorrow);
            })
            ->orderByRaw('CASE WHEN DATE(due_date) = ? THEN 0 WHEN DATE(due_date) = ? THEN 1 ELSE 2 END', [$today->toDateString(), $tomorrow->toDateString()])
            ->orderBy('due_date')
            ->limit(10)
            ->get(['id', 'title', 'due_date', 'status'])
            ->map(fn ($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'due_date' => $task->due_date->toDateString(),
                'type' => $task->due_date->lt($today)
                    ? 'overdue'
                    : ($task->due_date->isSameDay($today) ? 'due_today' : 'due_tomorrow'),
            ])
            ->values();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_tasks' => $totalTasks,
                'upcoming_tasks' => $upcomingTasks,
                'pending_tasks' => $pendingTasks,
                'in_progress_tasks' => $inProgressTasks,
                'completed_tasks' => $completedTasks,
                'overdue_tasks' => $overdueTasks,
                'due_today_tasks' => $dueTodayTasks,
                'completion_rate' => $completionRate,
            ],
            'priority_breakdown' => $priorityBreakdown,
            'categories' => $categories,
            'deadline_reminders' => $deadlineReminders,
        ]);
    }
}

