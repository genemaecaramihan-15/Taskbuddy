<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        $status = fake()->randomElement(['to_do', 'in_progress', 'completed']);
        $priority = fake()->randomElement(['low', 'medium', 'high', 'urgent']);
        $dueDate = fake()->boolean(80) 
            ? fake()->dateTimeBetween('-10 days', '+30 days')->format('Y-m-d') 
            : null;

        return [
            'user_id' => User::factory(),
            'category_id' => null,
            'title' => fake()->sentence(4),
            'description' => fake()->boolean(70) ? fake()->paragraph() : null,
            'status' => $status,
            'priority' => $priority,
            'due_date' => $dueDate,
            'completed_at' => $status === 'completed' ? Carbon::now()->subDays(rand(0, 5)) : null,
        ];
    }
}

