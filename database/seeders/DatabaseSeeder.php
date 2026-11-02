<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Alex Taylor',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Predefined realistic categories
        $categoriesData = [
            [
                'name' => 'Work Projects',
                'color' => '#3b82f6',
                'description' => 'Professional work tasks, sprint goals, and client deliverables.',
            ],
            [
                'name' => 'Personal Growth',
                'color' => '#10b981',
                'description' => 'Self-improvement, reading list, and habit tracking.',
            ],
            [
                'name' => 'Urgent Deadlines',
                'color' => '#ef4444',
                'description' => 'High-priority items requiring immediate attention.',
            ],
            [
                'name' => 'Software Development',
                'color' => '#8b5cf6',
                'description' => 'Feature coding, bug fixes, code reviews, and DevOps.',
            ],
            [
                'name' => 'Health & Fitness',
                'color' => '#f59e0b',
                'description' => 'Exercise routines, meal planning, and medical appointments.',
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $data) {
            $categories[] = Category::firstOrCreate(
                ['user_id' => $user->id, 'name' => $data['name']],
                array_merge($data, ['user_id' => $user->id])
            );
        }

        $workCat = $categories[0];
        $personalCat = $categories[1];
        $urgentCat = $categories[2];
        $devCat = $categories[3];
        $healthCat = $categories[4];

        $today = Carbon::today();

        // Sample tasks
        $tasksData = [
            [
                'title' => 'Finalize Q3 roadmap presentation',
                'description' => 'Review milestone deliverables with engineering leads and prepare slides for leadership meeting.',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => $today->copy()->toDateString(), // due today
                'category_id' => $workCat->id,
            ],
            [
                'title' => 'Submit security compliance audit report',
                'description' => 'Double check vulnerability scans, sign off and submit compliance checklist.',
                'status' => 'to_do',
                'priority' => 'urgent',
                'due_date' => $today->copy()->subDays(2)->toDateString(), // overdue
                'category_id' => $urgentCat->id,
            ],
            [
                'title' => 'Refactor Inertia navigation components',
                'description' => 'Optimize mobile responsiveness and sidebar active states for TaskBuddy.',
                'status' => 'completed',
                'priority' => 'medium',
                'due_date' => $today->copy()->subDays(1)->toDateString(),
                'completed_at' => Carbon::now()->subHours(8),
                'category_id' => $devCat->id,
            ],
            [
                'title' => 'Weekly team standup and sync',
                'description' => 'Discuss blockers, pending PRs, and team goals for the week.',
                'status' => 'to_do',
                'priority' => 'medium',
                'due_date' => $today->copy()->toDateString(), // due today
                'category_id' => $workCat->id,
            ],
            [
                'title' => 'Annual dental health checkup',
                'description' => 'Appointment scheduled at 3:00 PM downtown clinic.',
                'status' => 'to_do',
                'priority' => 'low',
                'due_date' => $today->copy()->addDays(3)->toDateString(),
                'category_id' => $healthCat->id,
            ],
            [
                'title' => 'Implement database indexing for task queries',
                'description' => 'Add compound indices on user_id, status, and due_date to improve query performance.',
                'status' => 'completed',
                'priority' => 'high',
                'due_date' => $today->copy()->subDays(3)->toDateString(),
                'completed_at' => Carbon::now()->subDays(2),
                'category_id' => $devCat->id,
            ],
            [
                'title' => 'Read Chapter 4 of "Designing Data-Intensive Applications"',
                'description' => 'Study encoding and evolution concepts and take notes.',
                'status' => 'to_do',
                'priority' => 'low',
                'due_date' => $today->copy()->addDays(5)->toDateString(),
                'category_id' => $personalCat->id,
            ],
            [
                'title' => 'Fix production SSL certificate renewal alert',
                'description' => 'Certbot automated renewal needs DNS token update on Cloudflare.',
                'status' => 'in_progress',
                'priority' => 'urgent',
                'due_date' => $today->copy()->toDateString(), // due today
                'category_id' => $urgentCat->id,
            ],
            [
                'title' => 'Morning 5K run and stretching routine',
                'description' => 'Maintain consistent cardio routine 3 times a week.',
                'status' => 'completed',
                'priority' => 'medium',
                'due_date' => $today->copy()->toDateString(),
                'completed_at' => Carbon::now()->subHours(10),
                'category_id' => $healthCat->id,
            ],
            [
                'title' => 'Draft blog post on Laravel & React integration',
                'description' => 'Share tips on Inertia.js, TypeScript type safety, and modern fullstack patterns.',
                'status' => 'to_do',
                'priority' => 'medium',
                'due_date' => $today->copy()->addDays(7)->toDateString(),
                'category_id' => $personalCat->id,
            ],
        ];

        foreach ($tasksData as $taskData) {
            Task::firstOrCreate(
                ['user_id' => $user->id, 'title' => $taskData['title']],
                array_merge($taskData, ['user_id' => $user->id])
            );
        }

        // Add 1 soft-deleted task for trash testing
        $trashedTask = Task::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Archive deprecated legacy API v1 documentation'],
            [
                'user_id' => $user->id,
                'description' => 'Old API endpoints have been superseded by v2.',
                'status' => 'completed',
                'priority' => 'low',
                'due_date' => $today->copy()->subDays(10)->toDateString(),
                'category_id' => $workCat->id,
            ]
        );
        if (!$trashedTask->trashed()) {
            $trashedTask->delete();
        }
    }
}
